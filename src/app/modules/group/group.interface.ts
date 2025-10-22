import { Types } from "mongoose";

export type GroupRole = "admin" | "moderator" | "member";

export interface IGroupMember {
  userId: Types.ObjectId; // reference to User._id
  role: GroupRole;
  joinedAt: Date;
}

export interface IGroup {
  _id?: Types.ObjectId; // same as IUser
  name: string;
  description: string;
  members: IGroupMember[];
  isPrivate: boolean;
  inviteCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}
