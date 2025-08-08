import { Router } from "express";
import { rideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuthorization";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { requestRideSchema } from "./ride.validation";

const router = Router();

router.post(
  "/request-ride",
  validateRequest(requestRideSchema),
  checkAuth(UserRole.RIDER),
  rideController.requestRide
);

router.post(
  "/accept-ride/:id",
  checkAuth(UserRole.DRIVER),
  rideController.acceptRide
);
router.post(
  "/reject-ride/:id",
  checkAuth(UserRole.DRIVER),
  rideController.rejectRide
);
router.patch(
  "/picked-up/:id",
  checkAuth(UserRole.DRIVER),
  rideController.markPickedUp
);

router.patch(
  "/in-transit/:id",
  checkAuth(UserRole.DRIVER),
  rideController.markInTransit
);

router.patch(
  "/completed/:id",
  checkAuth(UserRole.DRIVER),
  rideController.markCompleted
);
router.get(
  "/rideHistory",
  checkAuth(UserRole.RIDER),
  rideController.getRideHistory
);
router.patch(
  "/cancel/:id",
  checkAuth(UserRole.RIDER),
  rideController.cancelRide
);
router.get(
  "/get-all-ride",
  checkAuth(UserRole.ADMIN),
  rideController.getAllRide
);
export const rideRoutes = router;
