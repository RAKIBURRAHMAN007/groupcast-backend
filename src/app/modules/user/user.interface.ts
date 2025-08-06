import { Types } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  DRIVER = "driver",
  RIDER = "rider",
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
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  auths: IAuthProvider[];
}
