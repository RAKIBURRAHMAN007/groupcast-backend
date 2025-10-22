import http, { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { Server as SocketIOServer } from "socket.io";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected to MongoDB");

    // Create HTTP server for Express app
    server = http.createServer(app);

    // Initialize Socket.IO
    const io = new SocketIOServer(server, {
      cors: {
        origin: "*", // you can set your frontend URL instead of *
        methods: ["GET", "POST"],
      },
    });

    // Socket.IO logic
    io.on("connection", (socket) => {
      console.log(`🟢 User connected: ${socket.id}`);

      // Join group room
      socket.on("joinRoom", (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
      });

      // Send and broadcast messages
      socket.on("sendMessage", (data: { roomId: string; message: string }) => {
        console.log("Message received:", data);
        socket.to(data.roomId).emit("receiveMessage", data.message);
      });

      socket.on("disconnect", () => {
        console.log(`🔴 User disconnected: ${socket.id}`);
      });
    });

    // Start server
    const PORT = envVars.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
  }
};

// Run main function
(async () => {
  await startServer();
})();

// Handle graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (server) server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  if (server) server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM detected, shutting down gracefully...");
  if (server) server.close(() => process.exit(1));
});
