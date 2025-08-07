import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { verifyToken } from "../../utils/jwtTokenGenaration";
import { JwtPayload } from "jsonwebtoken";

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
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getAllUser();

    sendResponse(res, {
      data: user,
      message: "all user retrieved successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;

    const payload = req.body;
    const user = await userService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Updated Successfully",
      data: user,
    });
  }
);
const blockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const blockedUser = await userService.blockUser(userId);

    sendResponse(res, {
      data: blockedUser,
      message: "User blocked successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);
const unBlockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const blockedUser = await userService.unBlockUser(userId);

    sendResponse(res, {
      data: blockedUser,
      message: "User unBlocked successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const deletedUser = await userService.deleteUser(userId);

    sendResponse(res, {
      data: deletedUser,
      message: "User deleted successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);

export const userController = {
  createUser,
  getAllUser,
  updateUser,
  blockUser,
  unBlockUser,
  deleteUser,
};
