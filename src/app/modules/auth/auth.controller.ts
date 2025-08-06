import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authService.credentialLogin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginInfo,
    });
  }
);
export const authController = {
  login,
};
