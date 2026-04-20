import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import { UserRolesEnum } from "../utils/constant.js";

const ADMIN_ROLES = [UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN];

const getProjectIdFromParams = (req) => req.params.projectId || req.params.id;

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
};

const getProjectDescriptionField = () =>
  Project.schema.path("descriptionL") ? "descriptionL" : "description";

const ensureProjectMembership = async (projectId, userId) => {
  const membership = await ProjectMember.findOne({
    project: projectId,
    user: userId,
  });

  if (!membership) {
    throw new ApiError(403, "You are not a member of this project");
  }

  return membership;
};

const ensureProjectAdmin = async (projectId, userId) => {
  const membership = await ensureProjectMembership(projectId, userId);

  if (!ADMIN_ROLES.includes(membership.role)) {
    throw new ApiError(403, "Only project admins can perform this action");
  }

  return membership;
};

const getProjects = asyncHandler(async (req, res) => {
  const userObjectId = new mongoose.Types.ObjectId(req.user._id);

  const projects = await ProjectMember.aggregate([
    {
      $match: {
        user: userObjectId,
      },
    },
    {
      $lookup: {
        from: "projects",
        let: { projectId: "$project" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$projectId"],
              },
            },
          },
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
              description: {
                $ifNull: ["$description", "$descriptionL"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              description: 1,
              createdBy: 1,
              createdAt: 1,
              updatedAt: 1,
              members: 1,
            },
          },
        ],
        as: "project",
      },
    },
    {
      $unwind: "$project",
    },
    {
      $project: {
        _id: "$project._id",
        name: "$project.name",
        description: "$project.description",
        createdBy: "$project.createdBy",
        createdAt: "$project.createdAt",
        updatedAt: "$project.updatedAt",
        members: "$project.members",
        role: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);
  ensureValidObjectId(projectId, "project id");

  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  await ensureProjectMembership(projectObjectId, req.user._id);

  const [project] = await Project.aggregate([
    {
      $match: {
        _id: projectObjectId,
      },
    },
    {
      $lookup: {
        from: "projectmembers",
        localField: "_id",
        foreignField: "project",
        as: "projectmembers",
      },
    },
    {
      $addFields: {
        members: {
          $size: "$projectmembers",
        },
        description: {
          $ifNull: ["$description", "$descriptionL"],
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
        members: 1,
      },
    },
  ]);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Name and description are required");
  }

  const descriptionField = getProjectDescriptionField();

  const project = await Project.create({
    name: name.trim(),
    [descriptionField]: description.trim(),
    createdBy: req.user._id,
  });

  try {
    await ProjectMember.create({
      user: req.user._id,
      project: project._id,
      role: UserRolesEnum.ADMIN,
    });
  } catch (error) {
    await Project.findByIdAndDelete(project._id);
    throw error;
  }

  const projectData = {
    ...project.toObject(),
    description: project.description || project.descriptionL,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, projectData, "Project created successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const projectId = getProjectIdFromParams(req);

  ensureValidObjectId(projectId, "project id");

  await ensureProjectAdmin(projectId, req.user._id);

  if (!name?.trim() && !description?.trim()) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const descriptionField = getProjectDescriptionField();
  const updateData = {};

  if (name?.trim()) {
    updateData.name = name.trim();
  }

  if (description?.trim()) {
    updateData[descriptionField] = description.trim();
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedProject) {
    throw new ApiError(404, "Project not found");
  }

  const projectData = {
    ...updatedProject.toObject(),
    description: updatedProject.description || updatedProject.descriptionL,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, projectData, "Project updated successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);
  ensureValidObjectId(projectId, "project id");

  await ensureProjectAdmin(projectId, req.user._id);

  const deletedProject = await Project.findByIdAndDelete(projectId);

  if (!deletedProject) {
    throw new ApiError(404, "Project not found");
  }

  await ProjectMember.deleteMany({ project: projectId });

  return res
    .status(200)
    .json(new ApiResponse(200, deletedProject, "Project deleted successfully"));
});

const addMemberToProject = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);
  const { userId, role } = req.body;

  ensureValidObjectId(projectId, "project id");
  ensureValidObjectId(userId, "user id");

  await ensureProjectAdmin(projectId, req.user._id);

  const userExists = await User.exists({ _id: userId });

  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const existingMember = await ProjectMember.findOne({
    project: projectId,
    user: userId,
  });

  if (existingMember) {
    throw new ApiError(409, "User is already a project member");
  }

  const memberRole = role || UserRolesEnum.MEMBER;

  if (!Object.values(UserRolesEnum).includes(memberRole)) {
    throw new ApiError(400, "Invalid role");
  }

  const projectMember = await ProjectMember.create({
    project: projectId,
    user: userId,
    role: memberRole,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, projectMember, "Member added successfully"));
});

const removeMemberFromProject = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);
  const userId = req.params.userId || req.body.userId;

  ensureValidObjectId(projectId, "project id");
  ensureValidObjectId(userId, "user id");

  await ensureProjectAdmin(projectId, req.user._id);

  if (String(userId) === String(req.user._id)) {
    throw new ApiError(400, "Project admin cannot remove themself");
  }

  const memberToRemove = await ProjectMember.findOne({
    project: projectId,
    user: userId,
  });

  if (!memberToRemove) {
    throw new ApiError(404, "Project member not found");
  }

  if (ADMIN_ROLES.includes(memberToRemove.role)) {
    const adminCount = await ProjectMember.countDocuments({
      project: projectId,
      role: { $in: ADMIN_ROLES },
    });

    if (adminCount <= 1) {
      throw new ApiError(400, "At least one project admin must remain");
    }
  }

  await ProjectMember.deleteOne({ _id: memberToRemove._id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Member removed successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const projectId = getProjectIdFromParams(req);
  ensureValidObjectId(projectId, "project id");

  await ensureProjectMembership(projectId, req.user._id);

  const members = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        role: 1,
        user: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, members, "Project members fetched successfully"),
    );
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
  getProjectMembers,
};
