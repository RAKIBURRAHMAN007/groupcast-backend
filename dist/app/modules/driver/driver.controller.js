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
exports.driverController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_service_1 = require("./driver.service");
const requestDriverRegister = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const payload = req.body;
    const result = yield driver_service_1.driverService.requestDriverRegister(userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Driver registration submitted. Waiting for admin approval.",
        data: result,
    });
}));
const approveDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const result = yield driver_service_1.driverService.approveDriver(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver registration  approved.",
        data: result,
    });
}));
const suspendDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const result = yield driver_service_1.driverService.suspendDriver(driverId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver suspended.",
        data: result,
    });
}));
const getallDriver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.driverService.getallDriver();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Approved drivers retrieved successfully.",
        data: result,
    });
}));
const updateDriverLocation = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const { latitude, longitude } = req.body;
    const updatedDriver = yield driver_service_1.driverService.updateLocationAndStatus(driverId, latitude, longitude);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Driver location and status updated successfully",
        data: updatedDriver,
    });
}));
const setAbilityTrue = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const updatedDriver = yield driver_service_1.driverService.setAbilityTrue(driverId);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Driver ability online true successfully",
        data: updatedDriver,
    });
}));
const setAbilityFalse = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const updatedDriver = yield driver_service_1.driverService.setAbilityFalse(driverId);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "Driver ability online false successfully",
        data: updatedDriver,
    });
}));
const earningHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.user.userId;
    const earningHistory = yield driver_service_1.driverService.earningHistory(driverId);
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: "retrieved earning history successfully",
        data: earningHistory,
    });
}));
exports.driverController = {
    requestDriverRegister,
    approveDriver,
    getallDriver,
    suspendDriver,
    updateDriverLocation,
    setAbilityTrue,
    setAbilityFalse,
    earningHistory,
};
