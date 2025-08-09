import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/router";
import expressSession from "express-session";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { routeNotFound } from "./app/middlewares/routeNotFound";
import { envVars } from "./app/config/env";
const app = express();
app.use(express.json());
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.set("trust proxy", 1);
app.use(cors());
app.use(cookieParser());
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "welcome to ride sharing backend",
  });
});
app.use(globalErrorHandler);
app.use(routeNotFound);
export default app;
