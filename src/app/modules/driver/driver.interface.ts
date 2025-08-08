import { Types } from "mongoose";

export enum DriverStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
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
  earnings: number;
  currentRide?: Types.ObjectId | null;
  rating?: number;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  documents?: {
    type?: DocumentType;
    url?: string;
    verified?: boolean;
  }[];
  createdAt?: Date;
}
