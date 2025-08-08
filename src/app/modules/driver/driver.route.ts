import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuthorization";
import { UserRole } from "../user/user.interface";
import { driverController } from "./driver.controller";

const router = Router();
router.post(
  "/register",
  checkAuth(UserRole.RIDER),
  driverController.requestDriverRegister
);
router.patch(
  "/approve/:id",
  checkAuth(UserRole.ADMIN),
  driverController.approveDriver
);
router.patch(
  "/suspend/:id",
  checkAuth(UserRole.ADMIN),
  driverController.suspendDriver
);
router.post(
  "/get-all-driver",
  checkAuth(UserRole.ADMIN),
  driverController.getallDriver
);
router.patch(
  "/location",
  checkAuth(UserRole.DRIVER),
  driverController.updateDriverLocation
);
router.patch(
  "/set-ability-true",
  checkAuth(UserRole.DRIVER),
  driverController.setAbilityTrue
);
router.patch(
  "/set-ability-false",
  checkAuth(UserRole.DRIVER),
  driverController.setAbilityFalse
);
router.get(
  "/earningHistory",
  checkAuth(UserRole.DRIVER),
  driverController.earningHistory
);
export const driverRoutes = router;
