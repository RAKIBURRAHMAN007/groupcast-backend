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
    name: { type: String, required: true },

    phone: { type: String },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    auths: [authProviderSchema],
  },
  { timestamps: true, versionKey: false }
);
export const User = model<IUser>("User", userSchema);
