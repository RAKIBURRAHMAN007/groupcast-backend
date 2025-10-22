import AppError from "../../errorHelper/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";

const createUser = async (payload: Partial<IUser>) => {
  const { email, name } = payload;

  if (!email || !name) {
    throw new AppError(httpStatus.BAD_REQUEST, "Name and email are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const user = await User.create({ name, email });
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return user;
};

export const userService = {
  createUser,
  getUserByEmail,
  getUserById,
};
