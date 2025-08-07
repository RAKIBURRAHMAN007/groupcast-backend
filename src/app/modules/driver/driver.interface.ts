import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export enum DriverStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",
}

export enum DocumentType {
  LICENSE = "license",
  REGISTRATION = "registration",
  INSURANCE = "insurance",
}

export interface IDriver {
  user: Types.ObjectId;
  licenseNumber: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  status?: DriverStatus;
  isOnline?: boolean;
  currentRide?: Types.ObjectId | null;
  rating?: number;
  documents?: {
    type?: DocumentType;
    url?: string;
    verified?: boolean;
  }[];
  createdAt?: Date;
}
