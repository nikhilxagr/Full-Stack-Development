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


import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();




export default router;