import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// Create a new user
router.post("/", userController.createUser);

// Get user by ID
router.get("/id/:id", userController.getUserById);

// Get user by Email
router.get("/email/:email", userController.getUserByEmail);

export const UserRoutes = router;
