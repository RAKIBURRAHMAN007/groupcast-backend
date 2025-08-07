import { Ride } from "./ride.model";
import { Driver } from "../driver/driver.model";
import { IRide, RideStatus } from "./ride.interface";

import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";

import { DriverStatus } from "../driver/driver.interface";

const requestRide = async (
  riderId: string,
  pickupLocation: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) => {
  const nearestDrivers = await Driver.find({
    status: DriverStatus.APPROVED,
    isOnline: true,
    currentRide: null,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [pickupLocation.lng, pickupLocation.lat],
        },
        $maxDistance: 5000,
      },
    },
  }).limit(1);

  if (nearestDrivers.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No available drivers near you");
  }

  const nearestDriver = nearestDrivers[0];

  const ride = await Ride.create({
    riderId,
    driverId: nearestDriver._id,
    pickupLocation,
    destination,
    status: RideStatus.REQUESTED,
    requestedAt: new Date(),
  });

  return { ride, nearestDriver };
};

const acceptRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findOne({
    _id: rideId,
    status: RideStatus.REQUESTED,
  });
  if (!ride) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Ride not found or cannot be accepted"
    );
  }

  const driver = await Driver.findOne({ user: driverId, currentRide: null });

  if (!driver) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Driver not available to accept ride"
    );
  }

  ride.status = RideStatus.ACCEPTED;
  ride.acceptedAt = new Date();
  ride.driverId = driver._id;

  await ride.save();

  driver.currentRide = ride._id;
  await driver.save();

  return ride;
};
export const rideService = { requestRide, acceptRide };
