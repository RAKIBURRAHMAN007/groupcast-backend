import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);
    sendResponse(res, {
      data: user,
      message: "user created successfully",
      statusCode: httpStatus.CREATED,
      success: true,
    });
  }
);
export const userController = {
  createUser,
};
