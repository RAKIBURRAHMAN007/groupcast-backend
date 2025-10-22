import { Schema, model, Types, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  groupId: Types.ObjectId; // reference to Group._id
  assignedTo: Types.ObjectId[]; // array of User._id
  createdBy: Types.ObjectId; // reference to User._id
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId, // <-- Correct Mongoose type
      required: true,
      ref: "Group",
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId, // <-- Correct Mongoose type
        ref: "User",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId, // <-- Correct Mongoose type
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for faster queries
taskSchema.index({ groupId: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdBy: 1 });

export const Task = model<ITask>("Task", taskSchema);
