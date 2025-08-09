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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user already exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: authProvider }, rest));
    return user;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({});
    const totalUser = yield user_model_1.User.countDocuments();
    return { data: users, meta: { total: totalUser } };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const requesterRole = decodedToken.userRole;
    const requesterId = decodedToken.userId;
    if (requesterRole === user_interface_1.UserRole.RIDER || requesterRole === user_interface_1.UserRole.DRIVER) {
        if (userId !== requesterId) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized");
        }
    }
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (requesterRole === user_interface_1.UserRole.ADMIN &&
        existingUser.role === user_interface_1.UserRole.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to update this user");
    }
    const sensitiveFields = ["role", "isActive", "isDeleted", "isVerified"];
    const hasSensitiveUpdate = sensitiveFields.some((field) => field in payload);
    if (hasSensitiveUpdate &&
        (requesterRole === user_interface_1.UserRole.RIDER || requesterRole === user_interface_1.UserRole.DRIVER)) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to modify sensitive fields");
    }
    if ("email" in payload || "password" in payload) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Email or password cannot be updated");
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
});
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already blocked");
    }
    user.isBlocked = true;
    yield user.save();
    return user;
});
const unBlockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (!user.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already unBlocked");
    }
    user.isBlocked = false;
    yield user.save();
    return user;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already deleted");
    }
    user.isDeleted = true;
    yield user.save();
    return user;
});
exports.userService = {
    createUser,
    getAllUser,
    updateUser,
    blockUser,
    unBlockUser,
    deleteUser,
};
