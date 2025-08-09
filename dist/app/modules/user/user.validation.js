"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "name must be string" })
        .min(2, { message: "minimum 2 character" })
        .max(50, { message: "name too long" }),
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .min(8)
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phone: zod_1.z
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    isActive: zod_1.z.boolean().optional(),
    isBlocked: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.updateUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ error: "name must be string" })
        .min(2, { message: "minimum 2 character" })
        .max(50, { message: "name too long" })
        .optional(),
    phone: zod_1.z
        .string({ error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    isActive: zod_1.z.boolean().optional(),
    isBlocked: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
    isDeleted: zod_1.z.boolean().optional(),
});
