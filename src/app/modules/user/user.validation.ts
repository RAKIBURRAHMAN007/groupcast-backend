import { z } from "zod";
import { UserRole } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "name must be string" })
    .min(2, { message: "minimum 2 character" })
    .max(50, { message: "name too long" }),
  email: z.string().email(),
  password: z
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
  phone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  isActive: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ error: "name must be string" })
    .min(2, { message: "minimum 2 character" })
    .max(50, { message: "name too long" })
    .optional(),
  phone: z
    .string({ error: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),

  isActive: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});
