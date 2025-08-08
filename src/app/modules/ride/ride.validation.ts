import { z } from "zod";

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const requestRideSchema = z.object({
  pickupLocation: locationSchema,
  destination: locationSchema,
});
