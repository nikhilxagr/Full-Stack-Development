import { Router } from "express";

import {
  login,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";

import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
  getProjectMembers, 
} from "../controllers/project.controllers.js";


import { validateProjectPermissions, verifyJWT } from "../middlewares/auth.middleware.js";
import { create } from "domain";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(createProjectvalidator(),validate,createProject);

router
  .route("/:projectId")
  .get(validateProjectPermissions(AvalableUserRoles), getProjectById)
  .put(
    validateProjectPermissions([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]), updateProject)

  .delete(
    validateProjectPermissions([UserRolesEnum.ADMIN]), deleteProject);

router
  .route("/:projectId/members")

  .get(validateProjectPermissions(AvalableUserRoles), getProjectMembers)
  .post(
    validateProjectPermissions([UserRolesEnum.ADMIN]), addMemberToProjectValidator(), validate, addMemberToProject)

router
  .route("/:projectId/members/:userId")
  .put(
    validateProjectPermissions([UserRolesEnum.ADMIN]), updateMemberRoleValidator(), validate, addMemberToProject)
  .delete(
    validateProjectPermissions([UserRolesEnum.ADMIN]), removeMemberFromProject)


export default router;