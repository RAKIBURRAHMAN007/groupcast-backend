"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideService = void 0;
const ride_model_1 = require("./ride.model");
const driver_model_1 = require("../driver/driver.model");
const ride_interface_1 = require("./ride.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const driver_interface_1 = require("../driver/driver.interface");
const distance_1 = require("../../utils/distance");
const requestRide = (riderId, pickupLocation, destination) => __awaiter(void 0, void 0, void 0, function* () {
    const nearestDrivers = yield driver_model_1.Driver.find({
        status: driver_interface_1.DriverStatus.APPROVED,
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
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No available drivers near you");
    }
    const nearestDriver = nearestDrivers[0];
    const distance = (0, distance_1.calculateDistanceInKm)(pickupLocation.lat, pickupLocation.lng, destination.lat, destination.lng);
    const fare = (0, distance_1.calculateFare)(distance);
    const ride = yield ride_model_1.Ride.create({
        riderId,
        driverId: nearestDriver._id,
        pickupLocation,
        destination,
        distance,
        fare,
        status: ride_interface_1.RideStatus.REQUESTED,
        requestedAt: new Date(),
    });
    return { ride, nearestDriver };
});
const acceptRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findOne({
        _id: rideId,
        status: ride_interface_1.RideStatus.REQUESTED,
    });
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found or cannot be accepted");
    }
    const driver = yield driver_model_1.Driver.findOne({ user: driverId, currentRide: null });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver not available to accept ride");
    }
    ride.status = ride_interface_1.RideStatus.ACCEPTED;
    ride.acceptedAt = new Date();
    ride.driverId = driver._id;
    yield ride.save();
    driver.currentRide = ride._id;
    yield driver.save();
    return ride;
});
const rejectRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findOne({
        _id: rideId,
        status: ride_interface_1.RideStatus.REQUESTED,
    });
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found or cannot be rejected");
    }
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver not found");
    }
    ride.status = ride_interface_1.RideStatus.REJECTED;
    yield ride.save();
    return ride;
});
const markPickedUp = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findOne({
        _id: rideId,
        status: ride_interface_1.RideStatus.ACCEPTED,
    });
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found or not accepted");
    }
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver not found");
    }
    ride.status = ride_interface_1.RideStatus.PICKED_UP;
    ride.pickedUpAt = new Date();
    yield ride.save();
    return ride;
});
const markInTransit = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findOne({
        _id: rideId,
        status: ride_interface_1.RideStatus.PICKED_UP,
    });
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found or not picked up");
    }
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver not found");
    }
    ride.status = ride_interface_1.RideStatus.IN_TRANSIT;
    yield ride.save();
    return ride;
});
const markCompleted = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.Ride.findOne({
        _id: rideId,
        status: ride_interface_1.RideStatus.IN_TRANSIT,
    });
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found or not in transit");
    }
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver not found");
    }
    ride.status = ride_interface_1.RideStatus.COMPLETED;
    ride.completedAt = new Date();
    yield ride.save();
    yield driver_model_1.Driver.findByIdAndUpdate(driver._id, { currentRide: null });
    const rideFare = (_a = ride.fare) !== null && _a !== void 0 ? _a : 0;
    driver.earnings = (driver.earnings || 0) + rideFare;
    yield driver.save();
    return ride;
});
const getRideHistory = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({ riderId })
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
});
const cancelRide = (rideId, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findOne({ _id: rideId, riderId });
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride cannot be cancelled at this stage");
    }
    ride.status = ride_interface_1.RideStatus.CANCELLED;
    ride.cancelledAt = new Date();
    yield ride.save();
    if (ride.driverId) {
        yield driver_model_1.Driver.findByIdAndUpdate(ride.driverId, { currentRide: null });
    }
    return ride;
});
const getAllRide = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({});
    if (!rides) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "can't get any ride");
    }
    return rides;
});
exports.rideService = {
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
