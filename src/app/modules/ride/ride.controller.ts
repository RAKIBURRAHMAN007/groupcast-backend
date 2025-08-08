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
const rejectRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const driverId = req.user.userId;

    const ride = await rideService.rejectRide(rideId, driverId);

    sendResponse(res, {
      data: ride,
      message: "Ride rejected successfully",
      statusCode: httpStatus.OK,
      success: true,
    });
  }
);
const markPickedUp = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const driverId = req.user.userId;

  const ride = await rideService.markPickedUp(rideId, driverId);

  sendResponse(res, {
    data: ride,
    message: "Ride marked as picked up",
    statusCode: httpStatus.OK,
    success: true,
  });
});

const markInTransit = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const driverId = req.user.userId;

  const ride = await rideService.markInTransit(rideId, driverId);

  sendResponse(res, {
    data: ride,
    message: "Ride marked as in transit",
    statusCode: httpStatus.OK,
    success: true,
  });
});

const markCompleted = catchAsync(async (req: Request, res: Response) => {
  const rideId = req.params.id;
  const driverId = req.user.userId;

  const ride = await rideService.markCompleted(rideId, driverId);

  sendResponse(res, {
    data: ride,
    message: "Ride marked as completed",
    statusCode: httpStatus.OK,
    success: true,
  });
});
const getRideHistory = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.user.userId;

  const ride = await rideService.getRideHistory(riderId);

  sendResponse(res, {
    data: ride,
    message: "Rider history retrieved successfully",
    statusCode: httpStatus.OK,
    success: true,
  });
});
const cancelRide = catchAsync(async (req: Request, res: Response) => {
  const riderId = req.user.userId;
  const rideId = req.params.id;
  const ride = await rideService.cancelRide(rideId, riderId);

  sendResponse(res, {
    data: ride,
    message: "ride cancelled successfully",
    statusCode: httpStatus.OK,
    success: true,
  });
});
const getAllRide = catchAsync(async (req: Request, res: Response) => {
  const ride = await rideService.getAllRide();

  sendResponse(res, {
    data: ride,
    message: "get all ride  successfully",
    statusCode: httpStatus.OK,
    success: true,
  });
});

export const rideController = {
  requestRide,
  acceptRide,
  rejectRide,
  markPickedUp,
  markInTransit,
  markCompleted,
  getRideHistory,
  cancelRide,
  getAllRide,
};
