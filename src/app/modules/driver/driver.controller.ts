import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { driverService } from "./driver.service";

const requestDriverRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;

    const payload = req.body;

    const result = await driverService.requestDriverRegister(userId, payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Driver registration submitted. Waiting for admin approval.",
      data: result,
    });
  }
);
const approveDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.id;

    const result = await driverService.approveDriver(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver registration  approved.",
      data: result,
    });
  }
);
const suspendDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const driverId = req.params.id;

    const result = await driverService.suspendDriver(driverId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Driver suspended.",
      data: result,
    });
  }
);
const getallDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await driverService.getallDriver();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Approved drivers retrieved successfully.",
      data: result,
    });
  }
);

export const driverController = {
  requestDriverRegister,
  approveDriver,
  getallDriver,
  suspendDriver,
};
