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
exports.createNewAccessTokenWithRefreshToken = exports.createUserToken = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const jwtTokenGenaration_1 = require("./jwtTokenGenaration");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUserToken = (user) => {
    const jwtPayload = {
        email: user.email,
        userId: user._id,
        userRole: user.role,
    };
    const accessToken = (0, jwtTokenGenaration_1.generateToken)(jwtPayload, env_1.envVars.jwt_access_secrete, env_1.envVars.jwt_access_expires);
    const refreshToken = (0, jwtTokenGenaration_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRETE, env_1.envVars.JWT_REFRESH_EXPIRES);
    return { accessToken, refreshToken };
};
exports.createUserToken = createUserToken;
const createNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwtTokenGenaration_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRETE);
    const isUserExist = yield user_model_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
    }
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
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = (0, jwtTokenGenaration_1.generateToken)(jwtPayload, env_1.envVars.jwt_access_secrete, env_1.envVars.jwt_access_expires);
    return accessToken;
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
