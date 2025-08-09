"use strict";
// driver.service.ts
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
exports.driverService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_interface_1 = require("./driver.interface");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const driver_model_1 = require("./driver.model");
const user_interface_1 = require("../user/user.interface");
const requestDriverRegister = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const existingDriver = yield driver_model_1.Driver.findOne({ user: userId });
    if ((existingDriver === null || existingDriver === void 0 ? void 0 : existingDriver.status) === driver_interface_1.DriverStatus.APPROVED) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "User is already registered as a driver");
    }
    if (!payload.licenseNumber || !payload.vehicleInfo) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "License number and vehicle information are required");
    }
    const newDriver = yield driver_model_1.Driver.create(Object.assign(Object.assign({}, payload), { user: userId, status: driver_interface_1.DriverStatus.PENDING }));
    return newDriver;
});
const approveDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistDriver = yield driver_model_1.Driver.findById(driverId);
    if (!isExistDriver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver request doesn't exist");
    }
    const isUserExist = yield user_model_1.User.findById(isExistDriver.user);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Associated user not found");
    }
    if (isUserExist.role === user_interface_1.UserRole.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already a driver");
    }
    if (isExistDriver.status === driver_interface_1.DriverStatus.APPROVED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver already approved");
    }
    isUserExist.role = user_interface_1.UserRole.DRIVER;
    yield isUserExist.save();
    isExistDriver.status = driver_interface_1.DriverStatus.APPROVED;
    yield isExistDriver.save();
    return {
        message: "Driver approved successfully",
        driver: isExistDriver,
        user: isUserExist,
    };
});
const suspendDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistDriver = yield driver_model_1.Driver.findById(driverId);
    if (!isExistDriver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver does not exist");
    }
    const isUserExist = yield user_model_1.User.findById(isExistDriver.user);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Associated user not found");
    }
    if (isExistDriver.status === driver_interface_1.DriverStatus.SUSPENDED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver already suspended");
    }
    isUserExist.role = user_interface_1.UserRole.RIDER;
    yield isUserExist.save();
    isExistDriver.status = driver_interface_1.DriverStatus.SUSPENDED;
    yield isExistDriver.save();
    return {
        message: "Driver suspended successfully",
        driver: isExistDriver,
        user: isUserExist,
    };
});
const getallDriver = () => __awaiter(void 0, void 0, void 0, function* () {
    const approvedDrivers = yield driver_model_1.Driver.find({
        status: driver_interface_1.DriverStatus.APPROVED,
    }).populate("user", "name email role phone");
    return approvedDrivers;
});
const updateLocationAndStatus = (driverId, latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDriver = yield driver_model_1.Driver.findOneAndUpdate({ user: driverId }, {
        isOnline: true,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
    }, { new: true });
    return updatedDriver;
});
const setAbilityTrue = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (driver.isOnline) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver is already online");
    }
    driver.isOnline = true;
    yield driver.save();
    return driver;
});
const setAbilityFalse = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (!driver.isOnline) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver is already offline");
    }
    driver.isOnline = false;
    yield driver.save();
    return driver;
});
const earningHistory = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ user: driverId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This driver doesn't exist");
    }
    return { totalEarning: driver.earnings };
});
exports.driverService = {
    requestDriverRegister,
    approveDriver,
    getallDriver,
    suspendDriver,
    updateLocationAndStatus,
    setAbilityTrue,
    setAbilityFalse,
    earningHistory,
};
