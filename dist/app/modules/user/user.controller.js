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
exports.userController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        data: user,
        message: "user created successfully",
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getAllUser();
    (0, sendResponse_1.sendResponse)(res, {
        data: user,
        message: "all user retrieved successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = yield user_service_1.userService.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Updated Successfully",
        data: user,
    });
}));
const blockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const blockedUser = yield user_service_1.userService.blockUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: blockedUser,
        message: "User blocked successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const unBlockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const blockedUser = yield user_service_1.userService.unBlockUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: blockedUser,
        message: "User unBlocked successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
const deleteUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const deletedUser = yield user_service_1.userService.deleteUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: deletedUser,
        message: "User deleted successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true,
    });
}));
exports.userController = {
    createUser,
    getAllUser,
    updateUser,
    blockUser,
    unBlockUser,
    deleteUser,
};
