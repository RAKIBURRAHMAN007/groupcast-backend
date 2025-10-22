import { Schema, model } from "mongoose";
import { IGroup, IGroupMember } from "./group.interface";

// Sub-schema for group members
const groupMemberSchema = new Schema<IGroupMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["admin", "moderator", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Main Group schema
const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    members: [groupMemberSchema],
    isPrivate: { type: Boolean, default: false },
    inviteCode: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 11).toUpperCase(),
    },
  },
  { timestamps: true, versionKey: false }
);

groupSchema.index({ "members.userId": 1 });
groupSchema.index({ inviteCode: 1 });
groupSchema.index({ createdAt: -1 });

export const Group = model<IGroup>("Group", groupSchema);
