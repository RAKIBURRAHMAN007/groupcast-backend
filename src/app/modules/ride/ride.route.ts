import { Router } from "express";
import { rideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuthorization";
import { UserRole } from "../user/user.interface";

const router = Router();

router.post(
  "/request-ride",
  checkAuth(UserRole.RIDER),
  rideController.requestRide
);

router.post(
  "/accept-ride/:id",
  checkAuth(UserRole.DRIVER),
  rideController.acceptRide
);

export const rideRoutes = router;
