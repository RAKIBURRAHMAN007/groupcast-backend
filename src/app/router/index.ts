import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { driverRoutes } from "../modules/driver/driver.route";
import { rideRoutes } from "../modules/ride/ride.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/driver",
    route: driverRoutes,
  },
  {
    path: "/ride",
    route: rideRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
