import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { seedAdmin } from "./app/utils/seedAdmin";

let server: Server;
const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("connected to db");
    server = app.listen(5000, () => {
      console.log("server is running at port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await startServer();
  await seedAdmin();
})();
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection detected server shutting down....", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("uncaughtException detected server shutting down....", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGTERM", () => {
  console.log("SIGTERM signal detected server shutting down....");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
