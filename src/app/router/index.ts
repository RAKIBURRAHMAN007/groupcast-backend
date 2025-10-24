import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { groupRoutes } from "../modules/group/group.route";
import { messageRoutes } from "../modules/message/message.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/messages",
    route: messageRoutes,
  },
  {
    path: "/groups",
    route: groupRoutes,
  },
];
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
