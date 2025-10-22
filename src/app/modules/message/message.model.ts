import { Schema, model, Types, Document } from "mongoose";

export interface IMessage extends Document {
  groupId: Types.ObjectId; // reference to Group._id
  senderId: Types.ObjectId; // reference to User._id
  content: string;
  messageType: "text" | "image" | "file" | "system";
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    groupId: {
      type: Schema.Types.ObjectId, // <-- Use Schema.Types.ObjectId
      required: true,
      ref: "Group",
    },
    senderId: {
      type: Schema.Types.ObjectId, // <-- Use Schema.Types.ObjectId
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for fast queries
messageSchema.index({ groupId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });

export const Message = model<IMessage>("Message", messageSchema);
