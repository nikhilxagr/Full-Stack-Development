import { User } from "../models/user.models.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import mongoose from "mongoose";
import {AvailableUserRole,UserRolesEnum} from "../utils/constants.js";

const getTasks = asyncHandler(async (req, res) => {
    //comming soon
});
const createTasks = asyncHandler(async (req, res) => {
    //comming soon
});
const getTaskById = asyncHandler(async (req, res) => {
    //comming soon
});
const updateTask = asyncHandler(async (req, res) => {
    //comming soon
});
const deleteTask = asyncHandler(async (req, res) => {
    //comming soon
});

const deleteSubtask = asyncHandler(async (req, res) => {
    //comming soon
})

export { getTasks, createTasks, getTaskById, updateTask, deleteTask, deleteSubtask };