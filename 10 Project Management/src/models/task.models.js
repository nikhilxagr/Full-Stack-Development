import mongoose, { Schema } from "mongoose";

import { AvailableTaskStatus, TaskStatusEnum } from "../utils/constant.js";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    status: {
        type: String,
        enum: AvailableTaskStatus,
        default: TaskStatusEnum.TODO
    }, 
    dueDate: {
        type: Date,
        default: null
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    attachments:{
        type:[{
            url:String,
            mimetype:String,
            size:Number
        }],
        default:[]
    }
}, {
    timestamps: true
});

export const Task = mongoose.model("Task", taskSchema);