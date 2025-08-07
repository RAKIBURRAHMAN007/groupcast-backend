// driver.service.ts

import httpStatus from "http-status-codes";
import { DriverStatus, IDriver } from "./driver.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelper/AppError";
import { Driver } from "./driver.model";
import { UserRole } from "../user/user.interface";

const requestDriverRegister = async (
  userId: string,
  payload: Partial<IDriver>
) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingDriver = await Driver.findOne({ user: userId });
  if (existingDriver?.status === DriverStatus.APPROVED) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User is already registered as a driver"
    );
  }
  if (!payload.licenseNumber || !payload.vehicleInfo) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "License number and vehicle information are required"
    );
  }
  const newDriver = await Driver.create({
    ...payload,
    user: userId,
    status: DriverStatus.PENDING,
  });

  return newDriver;
};
const approveDriver = async (driverId: string) => {
  const isExistDriver = await Driver.findById(driverId);
  if (!isExistDriver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver request doesn't exist");
  }

  const isUserExist = await User.findById(isExistDriver.user);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Associated user not found");
  }
  if (isUserExist.role === UserRole.DRIVER) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already a driver");
  }
  if (isExistDriver.status === DriverStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver already approved");
  }
  isUserExist.role = UserRole.DRIVER;
  await isUserExist.save();

  isExistDriver.status = DriverStatus.APPROVED;
  await isExistDriver.save();

  return {
    message: "Driver approved successfully",
    driver: isExistDriver,
    user: isUserExist,
  };
};
const suspendDriver = async (driverId: string) => {
  const isExistDriver = await Driver.findById(driverId);
  if (!isExistDriver) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver does not exist");
  }

  const isUserExist = await User.findById(isExistDriver.user);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Associated user not found");
  }
  if (isExistDriver.status === DriverStatus.SUSPENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver already suspended");
  }
  isUserExist.role = UserRole.RIDER;
  await isUserExist.save();

  isExistDriver.status = DriverStatus.SUSPENDED;
  await isExistDriver.save();

  return {
    message: "Driver suspended successfully",
    driver: isExistDriver,
    user: isUserExist,
  };
};

const getallDriver = async () => {
  const approvedDrivers = await Driver.find({
    status: DriverStatus.APPROVED,
  }).populate("user", "name email role phone");

  return approvedDrivers;
};

export const driverService = {
  requestDriverRegister,
  approveDriver,
  getallDriver,
  suspendDriver,
};
