"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const locationSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
}, { _id: false });
const rideSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver" },
    pickupLocation: { type: locationSchema, required: true },
    destination: { type: locationSchema, required: true },
    status: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
        required: true,
        default: ride_interface_1.RideStatus.REQUESTED,
    },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    fare: { type: Number },
    distance: { type: Number },
    riderRating: { type: Number },
    driverRating: { type: Number },
}, {
    timestamps: true,
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
