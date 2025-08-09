"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "jwt_access_secrete",
        "jwt_access_expires",
        "BCRYPT_SALT_ROUND",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "JWT_REFRESH_SECRETE",
        "JWT_REFRESH_EXPIRES",
    ];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        jwt_access_secrete: process.env.jwt_access_secrete,
        jwt_access_expires: process.env.jwt_access_expires,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        JWT_REFRESH_SECRETE: process.env.JWT_REFRESH_SECRETE,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    };
};
exports.envVars = loadEnvVariables();
