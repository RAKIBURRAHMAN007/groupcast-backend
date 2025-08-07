import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuthorization";
import { UserRole } from "../user/user.interface";

const router = Router();
router.post("/login", authController.login);
router.post("/refresh-token", authController.getNewAccessToken);
router.post("/logout", authController.logout);
router.post(
  "/reset-password",
  checkAuth(...Object.values(UserRole)),
  authController.resetPassword
);
export const authRoutes = router;
