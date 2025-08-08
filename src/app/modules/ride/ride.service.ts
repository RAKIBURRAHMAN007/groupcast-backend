import { Ride } from "./ride.model";
import { Driver } from "../driver/driver.model";
import { IRide, RideStatus } from "./ride.interface";

import httpStatus from "http-status-codes";
import AppError from "../../errorHelper/AppError";

import { DriverStatus } from "../driver/driver.interface";
import { calculateDistanceInKm, calculateFare } from "../../utils/distance";

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
  const distance = calculateDistanceInKm(
    pickupLocation.lat,
    pickupLocation.lng,
    destination.lat,
    destination.lng
  );

  const fare = calculateFare(distance);
  const ride = await Ride.create({
    riderId,
    driverId: nearestDriver._id,
    pickupLocation,
    destination,
    distance,

    fare,
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
const rejectRide = async (rideId: string, driverId: string) => {
  const ride = await Ride.findOne({
    _id: rideId,
    status: RideStatus.REQUESTED,
  });

  if (!ride) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Ride not found or cannot be rejected"
    );
  }

  const driver = await Driver.findOne({ user: driverId });

  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }

  ride.status = RideStatus.REJECTED;

  await ride.save();

  return ride;
};
const markPickedUp = async (rideId: string, driverId: string) => {
  const ride = await Ride.findOne({
    _id: rideId,

    status: RideStatus.ACCEPTED,
  });

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found or not accepted");
  }
  const driver = await Driver.findOne({ user: driverId });

  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }

  ride.status = RideStatus.PICKED_UP;
  ride.pickedUpAt = new Date();

  await ride.save();

  return ride;
};

const markInTransit = async (rideId: string, driverId: string) => {
  const ride = await Ride.findOne({
    _id: rideId,

    status: RideStatus.PICKED_UP,
  });

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found or not picked up");
  }
  const driver = await Driver.findOne({ user: driverId });

  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }
  ride.status = RideStatus.IN_TRANSIT;

  await ride.save();

  return ride;
};

const markCompleted = async (rideId: string, driverId: string) => {
  const ride = await Ride.findOne({
    _id: rideId,

    status: RideStatus.IN_TRANSIT,
  });

  if (!ride) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Ride not found or not in transit"
    );
  }
  const driver = await Driver.findOne({ user: driverId });

  if (!driver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver not found");
  }

  ride.status = RideStatus.COMPLETED;
  ride.completedAt = new Date();

  await ride.save();

  await Driver.findByIdAndUpdate(driver._id, { currentRide: null });
  const rideFare = ride.fare ?? 0;
  driver.earnings = (driver.earnings || 0) + rideFare;

  await driver.save();
  return ride;
};
const getRideHistory = async (riderId: string) => {
  const rides = await Ride.find({ riderId })
    .sort({ createdAt: -1 })
    .populate({
      path: "driverId",
      select: "_id user",
      populate: {
        path: "user",
        select: "name phone",
      },
    })
    .lean();

  return rides;
};
const cancelRide = async (rideId: string, riderId: string) => {
  const ride = await Ride.findOne({ _id: rideId, riderId });

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.status !== RideStatus.REQUESTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Ride cannot be cancelled at this stage"
    );
  }

  ride.status = RideStatus.CANCELLED;
  ride.cancelledAt = new Date();

  await ride.save();

  if (ride.driverId) {
    await Driver.findByIdAndUpdate(ride.driverId, { currentRide: null });
  }

  return ride;
};
const getAllRide = async () => {
  const rides = await Ride.find({});
  if (!rides) {
    throw new AppError(httpStatus.NOT_FOUND, "can't get any ride");
  }
  return rides;
};
export const rideService = {
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
