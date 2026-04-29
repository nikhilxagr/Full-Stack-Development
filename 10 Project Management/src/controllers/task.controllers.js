import mongoose from "mongoose";

import { Project } from "../models/project.model.js";
import { SubTask } from "../models/subtask.models.js";
import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constant.js";

const taskPopulateOptions = [
  { path: "assignedBy", select: "avatar username fullname" },
  { path: "assignedTo", select: "avatar username fullname" },
];

const taskDetailPopulateOptions = [
  ...taskPopulateOptions,
  { path: "project", select: "name descriptionL createdAt updatedAt" },
];

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
};

const buildAttachments = (files = []) =>
  files.map((file) => ({
    url: `${process.env.SERVER_URL}/images/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
  }));

const validateTaskStatus = (status) => {
  if (status === undefined || status === null || status === "") {
    return undefined;
  }

  if (!AvailableTaskStatus.includes(status)) {
    throw new ApiError(400, "Invalid task status");
  }

  return status;
};

const normalizeTask = (task) => {
  if (!task) {
    return task;
  }

  const taskData = task.toObject();

  if (taskData.project && typeof taskData.project === "object") {
    taskData.project = {
      ...taskData.project,
      description:
        taskData.project.description || taskData.project.descriptionL,
    };
  }

  return taskData;
};

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  ensureValidObjectId(projectId, "project id");

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({ project: projectId })
    .sort({ createdAt: -1 })
    .populate(taskPopulateOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

const createTasks = asyncHandler(async (req, res) => {
  const { title, description, status, assignedTo, dueDate } = req.body;
  const { projectId } = req.params;

  ensureValidObjectId(projectId, "project id");

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (!title?.trim()) {
    throw new ApiError(400, "Task title is required");
  }

  const resolvedStatus = validateTaskStatus(status) ?? TaskStatusEnum.TODO;

  let assignedToUserId;

  if (assignedTo) {
    ensureValidObjectId(assignedTo, "assignedTo");

    const assignee = await User.findById(assignedTo);

    if (!assignee) {
      throw new ApiError(404, "Assigned user not found");
    }

    assignedToUserId = assignee._id;
  }

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim(),
    project: project._id,
    assignedTo: assignedToUserId,
    assignedBy: req.user._id,
    status: resolvedStatus,
    dueDate: dueDate || undefined,
    attachments: buildAttachments(req.files || []),
  });

  await task.populate(taskPopulateOptions);

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  ensureValidObjectId(taskId, "task id");

  const task = await Task.findById(taskId).populate(taskDetailPopulateOptions);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtasks = await SubTask.find({ task: taskId }).populate(
    "createdBy",
    "avatar username fullname",
  );

  const taskData = normalizeTask(task);
  taskData.subtasks = subtasks;

  return res
    .status(200)
    .json(new ApiResponse(200, taskData, "Task retrieved successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, assignedTo, dueDate } = req.body;

  ensureValidObjectId(taskId, "task id");

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const updateData = {};

  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, "Task title cannot be empty");
    }

    updateData.title = title.trim();
  }

  if (description !== undefined) {
    updateData.description = description.trim();
  }

  if (status !== undefined) {
    updateData.status = validateTaskStatus(status);
  }

  if (assignedTo !== undefined) {
    if (assignedTo === "") {
      updateData.assignedTo = undefined;
    } else {
      ensureValidObjectId(assignedTo, "assignedTo");

      const assignee = await User.findById(assignedTo);

      if (!assignee) {
        throw new ApiError(404, "Assigned user not found");
      }

      updateData.assignedTo = assignee._id;
    }
  }

  if (dueDate !== undefined) {
    updateData.dueDate = dueDate || undefined;
  }

  const newAttachments = buildAttachments(req.files || []);

  if (newAttachments.length > 0) {
    updateData.attachments = [...task.attachments, ...newAttachments];
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  }).populate(taskPopulateOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  ensureValidObjectId(taskId, "task id");

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await SubTask.deleteMany({ task: task._id });
  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});

const deleteSubtask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId, subTaskId, id } = req.params;
  const resolvedSubtaskId = subtaskId || subTaskId || id;

  if (!resolvedSubtaskId) {
    throw new ApiError(400, "Subtask id is required");
  }

  ensureValidObjectId(resolvedSubtaskId, "subtask id");

  if (taskId) {
    ensureValidObjectId(taskId, "task id");
  }

  const query = { _id: resolvedSubtaskId };

  if (taskId) {
    query.task = taskId;
  }

  const subtask = await SubTask.findOneAndDelete(query);

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask deleted successfully"));
});

export {
  getTasks,
  createTasks,
  getTaskById,
  updateTask,
  deleteTask,
  deleteSubtask,
};
