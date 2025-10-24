/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import AppError from "../../errorHelper/AppError";
import { Message } from "./message.model";
import { Group } from "../group/group.model";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { User } from "../user/user.model";

// Get messages for a group with pagination
const getMessagesByGroup = async (
  groupId: string,
  page: number = 1,
  limit: number = 50
) => {
  if (!Types.ObjectId.isValid(groupId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid group ID");
  }

  const group = await Group.findById(groupId);
  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({ groupId })
    .populate("senderId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalMessages = await Message.countDocuments({ groupId });

  return {
    messages: messages.reverse(), // Return in chronological order
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages,
      hasMore: skip + messages.length < totalMessages,
    },
  };
};

// Send message
const sendMessage = async (messageData: {
  groupId: string;
  content: string;
  messageType?: "text" | "image" | "file";
  senderEmail: string;
}) => {
  // Find user by email to get userId
  const user = await User.findOne({ email: messageData.senderEmail });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid sender: User not found");
  }

  // Verify user is member of group
  const group = await Group.findById(messageData.groupId);
  if (!group) {
    throw new AppError(httpStatus.NOT_FOUND, "Group not found");
  }

  const isMember = group.members.some(
    (m: any) => m.userId.toString() === user._id.toString()
  );

  if (!isMember) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not a member of this group"
    );
  }

  const message = await Message.create({
    groupId: messageData.groupId,
    senderId: user._id,
    content: messageData.content,
    messageType: messageData.messageType || "text",
  });

  return await Message.findById(message._id)
    .populate("senderId", "name email")
    .lean();
};

// Delete message
const deleteMessage = async (messageId: string, userEmail: string) => {
  // Find user by email
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid user: User not found");
  }

  const message = await Message.findById(messageId);
  if (!message) {
    throw new AppError(httpStatus.NOT_FOUND, "Message not found");
  }

  // Check if user is the sender
  if (message.senderId.toString() !== user._id.toString()) {
    // Check if user is admin of the group
    const group = await Group.findById(message.groupId);
    const isAdmin = group?.members.some(
      (m: any) =>
        m.userId.toString() === user._id.toString() && m.role === "admin"
    );

    if (!isAdmin) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can only delete your own messages"
      );
    }
  }

  await Message.findByIdAndDelete(messageId);
};

export const messageService = {
  sendMessage,
  getMessagesByGroup,
  deleteMessage,
};
