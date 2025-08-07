import { model, Schema } from "mongoose";

import { DriverStatus } from "./driver.interface";

const driverSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleInfo: {
      make: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      color: { type: String, required: true },
      licensePlate: { type: String, required: true, unique: true },
    },
    status: {
      type: String,
      enum: Object.values(DriverStatus),
      default: DriverStatus.PENDING,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    currentRide: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    documents: {
      type: [
        {
          type: {
            type: String,
            enum: ["license", "registration", "insurance"],
          },
          url: String,
          verified: { type: Boolean, default: false },
        },
      ],
      required: false,
      default: undefined,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Driver = model("Driver", driverSchema);
