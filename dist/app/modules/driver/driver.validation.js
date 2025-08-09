"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDriverRegisterSchema = void 0;
const zod_1 = require("zod");
const DocumentTypeEnum = zod_1.z.enum(["license", "registration", "insurance"]);
const vehicleInfoSchema = zod_1.z.object({
    make: zod_1.z.string().min(2, "Vehicle make is required minimum 2 character"),
    model: zod_1.z.string().min(1, "Vehicle model is required"),
    year: zod_1.z
        .number()
        .int()
        .gte(1900, "Year must be valid")
        .lte(new Date().getFullYear(), "Year can't be in the future"),
    color: zod_1.z.string().min(1, "Vehicle color is required"),
    licensePlate: zod_1.z.string().min(1, "License plate is required"),
});
const documentSchema = zod_1.z.object({
    type: DocumentTypeEnum.optional(),
    url: zod_1.z.string().url().optional(),
    verified: zod_1.z.boolean().optional(),
});
const locationSchema = zod_1.z.object({
    type: zod_1.z.literal("Point"),
    coordinates: zod_1.z
        .tuple([zod_1.z.number(), zod_1.z.number()])
        .refine(([lng, lat]) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180, "Invalid latitude or longitude"),
});
exports.requestDriverRegisterSchema = zod_1.z.object({
    licenseNumber: zod_1.z.string().min(1, "License number is required"),
    vehicleInfo: vehicleInfoSchema,
    documents: zod_1.z.array(documentSchema).optional(),
    location: locationSchema,
});
