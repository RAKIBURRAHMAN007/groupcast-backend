"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const driverSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: Object.values(driver_interface_1.DriverStatus),
        default: driver_interface_1.DriverStatus.PENDING,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    currentRide: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true, versionKey: false });
driverSchema.index({ location: "2dsphere" });
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
