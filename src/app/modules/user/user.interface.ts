import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}
