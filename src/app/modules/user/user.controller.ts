/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user,
    });
  }
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User fetched successfully",
      data: user,
    });
  }
);

const getUserByEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserByEmail(req.params.email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User fetched successfully",
      data: user,
    });
  }
);

export const userController = {
  createUser,
  getUserById,
  getUserByEmail,
};
