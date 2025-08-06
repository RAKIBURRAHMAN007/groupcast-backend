import { IUser } from "../user/user.interface";

export enum DriverStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  SUSPENDED = "suspended",
}
export interface IDriver extends IUser {
  vehicleType: string;
  licenseNumber: string;
  vehicleRegistration: string;
  status: DriverStatus;
  isApproved: boolean;
  rating?: number;
  totalRides: number;
}
