"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRideSchema = void 0;
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    lat: zod_1.z.number(),
    lng: zod_1.z.number(),
});
exports.requestRideSchema = zod_1.z.object({
    pickupLocation: locationSchema,
    destination: locationSchema,
});
