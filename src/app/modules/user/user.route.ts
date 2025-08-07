import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuthorization";
import { UserRole } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);
router.get("/", checkAuth(UserRole.ADMIN), userController.getAllUser);
router.delete(
  "/delete/:id",
  checkAuth(UserRole.ADMIN),
  userController.deleteUser
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(UserRole)),

  userController.updateUser
);
router.patch("/block/:id", checkAuth(UserRole.ADMIN), userController.blockUser);
router.patch(
  "/unBlock/:id",
  checkAuth(UserRole.ADMIN),
  userController.unBlockUser
);

export const UserRoutes = router;
