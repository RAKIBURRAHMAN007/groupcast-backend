import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExist = await User.findOne({ password });
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
export const userService = {
  createUser,
};
