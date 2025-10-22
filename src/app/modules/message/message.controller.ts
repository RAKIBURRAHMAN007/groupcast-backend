import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { messageService } from "./message.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

// Send a new message
const sendMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const message = await messageService.sendMessage(req.body);
    sendResponse(res, {
      data: message,
      message: "Message sent successfully",
      statusCode: httpStatus.CREATED,
      success: true,
    });
  }
);

// Get messages for a group
const getMessagesByGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const groupId = req.params.groupId;
    const messages = await messageService.getMessagesByGroup(groupId);
    sendResponse(res, {
      data: messages,
      message: "Messages fetched successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);

export const messageController = {
  sendMessage,
  getMessagesByGroup,
};
