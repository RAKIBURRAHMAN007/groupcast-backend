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
exports.checkAuth = void 0;
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const jwtTokenGenaration_1 = require("../utils/jwtTokenGenaration");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(403, "no token received");
        }
        const verifiedToken = (0, jwtTokenGenaration_1.verifyToken)(accessToken, env_1.envVars.jwt_access_secrete);
        const isUserExist = yield user_model_1.User.findOne({ email: verifiedToken.email });
        if (!isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        if (isUserExist.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
        }
        if (isUserExist.isBlocked) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is blocked");
        }
        if (!isUserExist.isActive) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not active");
        }
        if (isUserExist.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
        }
        if (!verifiedToken) {
            throw new AppError_1.default(403, "not verified");
        }
        if (!authRoles.includes(verifiedToken.userRole)) {
            throw new AppError_1.default(403, "you are not permitted to this route");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.checkAuth = checkAuth;
