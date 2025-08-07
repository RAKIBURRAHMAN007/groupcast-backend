import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { rideService } from "./ride.service";

const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { pickupLocation, destination } = req.body;
    const riderId = req.user.userId;
    const ride = await rideService.requestRide(
      riderId,
      pickupLocation,
      destination
    );

    sendResponse(res, {
      data: ride,
      message: "Ride requested successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);
const acceptRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const driverId = req.user.userId;

    const ride = await rideService.acceptRide(rideId, driverId);

    sendResponse(res, {
      data: ride,
      message: "Ride accepted successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);

export const rideController = {
  requestRide,
  acceptRide,
};
