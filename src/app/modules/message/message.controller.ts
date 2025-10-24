/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { messageService } from "./message.service";

// Send a new message
const sendMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { senderEmail, ...messageData } = req.body;

    if (!senderEmail) {
      return sendResponse(res, {
        success: false,
        message: "Sender email is required",
        statusCode: httpStatus.BAD_REQUEST,
        data: null,
      });
    }

    const message = await messageService.sendMessage({
      ...messageData,
      senderEmail,
    });

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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = await messageService.getMessagesByGroup(
      groupId,
      page,
      limit
    );
    sendResponse(res, {
      data: result,
      message: "Messages fetched successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);

// Delete a message with user email in URL params
const deleteMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { messageId, userEmail } = req.params;

    if (!userEmail) {
      return sendResponse(res, {
        success: false,
        message: "User email is required",
        statusCode: httpStatus.BAD_REQUEST,
        data: null,
      });
    }

    await messageService.deleteMessage(messageId, userEmail);
    sendResponse(res, {
      data: null,
      message: "Message deleted successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);

export const messageController = {
  sendMessage,
  getMessagesByGroup,
  deleteMessage,
};
