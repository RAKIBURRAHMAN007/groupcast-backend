import { Schema, model } from "mongoose";
import { IAuthProvider, IUser, UserRole } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.RIDER,
    },
    name: { type: String },

    phone: { type: String },
    isActive: { type: Boolean, default: true },
    auths: [authProviderSchema],
  },
  { timestamps: true, versionKey: false }
);
export const User = model<IUser>("User", userSchema);
