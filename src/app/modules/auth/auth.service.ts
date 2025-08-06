import AppError from "../../errorHelper/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "user doesn't exist");
  }
  const isPasswordMatch = await bcrypt.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "password doesn't match");
  }
  const { password: pass, ...rest } = isUserExist.toObject();
  return {
    user: rest,
  };
};
export const authService = { credentialLogin };
