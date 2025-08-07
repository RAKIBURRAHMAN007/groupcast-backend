import { Types } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  DRIVER = "DRIVER",
  RIDER = "RIDER",
}
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  role?: UserRole;
  name: string;

  phone?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  auths: IAuthProvider[];
}
