import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwtTokenGenaration";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    email: user.email,
    userId: user._id,
    userRole: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.jwt_access_secrete,
    envVars.jwt_access_expires
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRETE,
    envVars.JWT_REFRESH_EXPIRES
  );
  return { accessToken, refreshToken };
};
export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRETE
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
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

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.jwt_access_secrete,
    envVars.jwt_access_expires
  );

  return accessToken;
};
