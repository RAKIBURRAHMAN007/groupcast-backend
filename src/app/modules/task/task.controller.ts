import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { taskService } from "./task.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

// Create a new task
const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await taskService.createTask(req.body);
    sendResponse(res, {
      data: task,
      message: "Task created successfully",
      statusCode: httpStatus.CREATED,
      success: true,
    });
  }
);

// Get tasks by groupId
const getTasksByGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.groupId;
    const tasks = await taskService.getTasksByGroup(groupId);
    sendResponse(res, {
      data: tasks,
      message: "Tasks fetched successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);

export const taskController = {
  createTask,
  getTasksByGroup,
};
