import { z } from "zod";

const DocumentTypeEnum = z.enum(["license", "registration", "insurance"]);

const vehicleInfoSchema = z.object({
  make: z.string().min(2, "Vehicle make is required minimum 2 character"),
  model: z.string().min(1, "Vehicle model is required"),
  year: z
    .number()
    .int()
    .gte(1900, "Year must be valid")
    .lte(new Date().getFullYear(), "Year can't be in the future"),
  color: z.string().min(1, "Vehicle color is required"),
  licensePlate: z.string().min(1, "License plate is required"),
});

const documentSchema = z.object({
  type: DocumentTypeEnum.optional(),
  url: z.string().url().optional(),
  verified: z.boolean().optional(),
});

const locationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z
    .tuple([z.number(), z.number()])
    .refine(
      ([lng, lat]) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180,
      "Invalid latitude or longitude"
    ),
});

export const requestDriverRegisterSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  vehicleInfo: vehicleInfoSchema,
  documents: z.array(documentSchema).optional(),
  location: locationSchema,
});
