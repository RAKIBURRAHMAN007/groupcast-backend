import { model, Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

const locationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
  },
  { _id: false }
);

const rideSchema = new Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },

    pickupLocation: { type: locationSchema, required: true },
    destination: { type: locationSchema, required: true },

    status: {
      type: String,
      enum: Object.values(RideStatus),
      required: true,
      default: RideStatus.REQUESTED,
    },

    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },

    fare: { type: Number },
    distance: { type: Number },
    estimatedDuration: { type: Number },

    riderRating: { type: Number },
    driverRating: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Ride = model<IRide>("Ride", rideSchema);
