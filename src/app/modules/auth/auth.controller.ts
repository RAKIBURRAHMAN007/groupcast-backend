import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { setAuthCookie } from "../../utils/setCookie";
import AppError from "../../errorHelper/AppError";
import { JwtPayload } from "jsonwebtoken";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await authService.credentialLogin(req.body);
    setAuthCookie(res, loginInfo);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginInfo,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token received from cookies"
      );
    }
    const tokenInfo = await authService.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);
    sendResponse(res, {
      message: "new access token retrieved  successfully",
      success: true,
      statusCode: httpStatus.OK,
      data: tokenInfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      message: "user logout  successfully",
      success: true,
      statusCode: httpStatus.OK,
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    await authService.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );
    sendResponse(res, {
      message: "user password changed  successfully",
      success: true,
      statusCode: httpStatus.OK,
      data: null,
    });
  }
);
export const authController = {
  login,
  getNewAccessToken,
  logout,
  resetPassword,
};
