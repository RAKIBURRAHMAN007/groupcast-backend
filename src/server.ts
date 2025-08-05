import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";

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
})();
