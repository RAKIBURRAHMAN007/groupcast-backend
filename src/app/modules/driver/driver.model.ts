import { model, Schema } from "mongoose";

import { DriverStatus, IDriver } from "./driver.interface";

const driverSchema = new Schema<IDriver>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    earnings: {
      type: Number,
      default: 0,
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
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true, versionKey: false }
);
driverSchema.index({ location: "2dsphere" });
export const Driver = model("Driver", driverSchema);
