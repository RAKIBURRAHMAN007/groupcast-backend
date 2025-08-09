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
exports.rideController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ride_service_1 = require("./ride.service");
const requestRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickupLocation, destination } = req.body;
    const riderId = req.user.userId;
    const ride = yield ride_service_1.rideService.requestRide(riderId, pickupLocation, destination);
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "Ride requested successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const acceptRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const driverId = req.user.userId;
    const ride = yield ride_service_1.rideService.acceptRide(rideId, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "Ride accepted successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const rejectRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const driverId = req.user.userId;
    const ride = yield ride_service_1.rideService.rejectRide(rideId, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "Ride rejected successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const markPickedUp = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const driverId = req.user.userId;
    const ride = yield ride_service_1.rideService.markPickedUp(rideId, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "Ride marked as picked up",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const markInTransit = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const driverId = req.user.userId;
    const ride = yield ride_service_1.rideService.markInTransit(rideId, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "Ride marked as in transit",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const markCompleted = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const driverId = req.user.userId;
    const ride = yield ride_service_1.rideService.markCompleted(rideId, driverId);
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "Ride marked as completed",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const getRideHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user.userId;
    const ride = yield ride_service_1.rideService.getRideHistory(riderId);
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "Rider history retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const cancelRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user.userId;
    const rideId = req.params.id;
    const ride = yield ride_service_1.rideService.cancelRide(rideId, riderId);
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "ride cancelled successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const getAllRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_service_1.rideService.getAllRide();
    (0, sendResponse_1.sendResponse)(res, {
        data: ride,
        message: "get all ride  successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
exports.rideController = {
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
