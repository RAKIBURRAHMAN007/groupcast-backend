import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();
router.post("/login", authController.login);
router.post("/refresh-token", authController.getNewAccessToken);
export const authRoutes = router;
