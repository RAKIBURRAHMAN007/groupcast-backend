/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";
import { groupService } from "./group.service";

const createGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email) {
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));
    }
    const group = await groupService.createGroup(req.body, email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Group created successfully",
      data: group,
    });
  }
);

const getGroupById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const group = await groupService.getGroupById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Group fetched successfully",
      data: group,
    });
  }
);

const getUserGroups = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email) {
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));
    }
    const groups = await groupService.getUserGroups(email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User groups fetched successfully",
      data: groups,
    });
  }
);

const joinGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    const { inviteCode } = req.body;
    if (!email)
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));

    const group = await groupService.joinGroup(inviteCode, email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Joined group successfully",
      data: group,
    });
  }
);

const updateGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email)
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));

    const group = await groupService.updateGroup(
      req.params.id,
      req.body,
      email
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Group updated successfully",
      data: group,
    });
  }
);

const deleteGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email)
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));

    await groupService.deleteGroup(req.params.id, email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Group deleted successfully",
      data: null,
    });
  }
);

const addGroupMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email)
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));

    const group = await groupService.addGroupMember(
      req.params.id,
      req.body.userEmail,
      req.body.role,
      email
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Member added successfully",
      data: group,
    });
  }
);

const removeGroupMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email)
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));

    const group = await groupService.removeGroupMember(
      req.params.id,
      req.params.memberEmail,
      email
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Member removed successfully",
      data: group,
    });
  }
);

const updateMemberRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email)
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));

    const group = await groupService.updateMemberRole(
      req.params.id,
      req.params.memberEmail,
      req.body.role,
      email
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Member role updated successfully",
      data: group,
    });
  }
);

const regenerateInviteCode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.params;
    if (!email)
      return next(new AppError(httpStatus.BAD_REQUEST, "Email is required"));

    const group = await groupService.regenerateInviteCode(req.params.id, email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Invite code regenerated successfully",
      data: group,
    });
  }
);

export const groupController = {
  createGroup,
  getGroupById,
  getUserGroups,
  joinGroup,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
  updateMemberRole,
  regenerateInviteCode,
};
