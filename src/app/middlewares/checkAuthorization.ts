import { NextFunction, Request, Response } from "express";

import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import AppError from "../errorHelper/AppError";
import { verifyToken } from "../utils/jwtTokenGenaration";
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = await req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "no token received");
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.jwt_access_secrete
      ) as JwtPayload;
      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (isUserExist.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is blocked");
      }

      if (!isUserExist.isActive) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not active");
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }
      if (!verifiedToken) {
        throw new AppError(403, "not verified");
      }
      if (!authRoles.includes(verifiedToken.userRole)) {
        throw new AppError(403, "you are not permitted to this route");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
