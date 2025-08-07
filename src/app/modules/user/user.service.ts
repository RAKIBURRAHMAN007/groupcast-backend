import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user already exist");
  }
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: authProvider,
    ...rest,
  });
  return user;
};
const getAllUser = async () => {
  const users = await User.find({});
  const totalUser = await User.countDocuments();
  return { data: users, meta: { total: totalUser } };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const requesterRole = decodedToken.userRole;
  const requesterId = decodedToken.userId;

  if (requesterRole === UserRole.RIDER || requesterRole === UserRole.DRIVER) {
    if (userId !== requesterId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }
  }

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    requesterRole === UserRole.ADMIN &&
    existingUser.role === UserRole.ADMIN
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to update this user"
    );
  }

  const sensitiveFields = ["role", "isActive", "isDeleted", "isVerified"];
  const hasSensitiveUpdate = sensitiveFields.some((field) => field in payload);

  if (
    hasSensitiveUpdate &&
    (requesterRole === UserRole.RIDER || requesterRole === UserRole.DRIVER)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to modify sensitive fields"
    );
  }

  if ("email" in payload || "password" in payload) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Email or password cannot be updated"
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};
const blockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already blocked");
  }

  user.isBlocked = true;
  await user.save();

  return user;
};
const unBlockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already unBlocked");
  }

  user.isBlocked = false;
  await user.save();

  return user;
};
const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already deleted");
  }

  user.isDeleted = true;
  await user.save();

  return user;
};

export const userService = {
  createUser,
  getAllUser,
  updateUser,
  blockUser,
  unBlockUser,
  deleteUser,
};
