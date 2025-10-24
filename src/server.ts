/* eslint-disable @typescript-eslint/no-explicit-any */
import http, { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import app from "./app";
import { Server as SocketIOServer } from "socket.io";
import { Message } from "./app/modules/message/message.model";
import { Group } from "./app/modules/group/group.model";
import { User } from "./app/modules/user/user.model";

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
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // Track online users
    const onlineUsers = new Map<string, Set<string>>();

    // Socket.IO logic
    io.on("connection", (socket) => {
      console.log(`🟢 User connected: ${socket.id}`);

      // User authentication with EMAIL
      socket.on("authenticate", async (data: { email: string }) => {
        try {
          const user = await User.findOne({ email: data.email });
          if (!user) {
            socket.emit("error", { message: "User not found" });
            return;
          }

          socket.data.userEmail = data.email;
          socket.data.userId = user._id.toString();
          console.log(
            `User ${data.email} authenticated with socket ${socket.id}`
          );
        } catch (error) {
          console.error("Authentication error:", error);
          socket.emit("error", { message: "Authentication failed" });
        }
      });

      // Join group room
      socket.on("joinGroup", async (groupId: string) => {
        try {
          // Verify user is member of group using EMAIL
          const group = await Group.findById(groupId).populate(
            "members.userId",
            "email"
          );
          if (!group) {
            socket.emit("error", { message: "Group not found" });
            return;
          }

          const userEmail = socket.data.userEmail;
          const isMember = group.members.some(
            (m: any) => m.userId.email === userEmail
          );

          if (!isMember) {
            socket.emit("error", {
              message: "You are not a member of this group",
            });
            return;
          }

          socket.join(groupId);

          // Track online users
          if (!onlineUsers.has(groupId)) {
            onlineUsers.set(groupId, new Set());
          }
          onlineUsers.get(groupId)?.add(userEmail);

          // Notify others user joined
          io.to(groupId).emit("userOnline", {
            userEmail,
            onlineCount: onlineUsers.get(groupId)?.size || 0,
          });

          console.log(`User ${userEmail} joined group ${groupId}`);
        } catch (error) {
          console.error("Error joining group:", error);
          socket.emit("error", { message: "Failed to join group" });
        }
      });

      // Leave group room
      socket.on("leaveGroup", (groupId: string) => {
        socket.leave(groupId);
        const userEmail = socket.data.userEmail;

        if (onlineUsers.has(groupId)) {
          onlineUsers.get(groupId)?.delete(userEmail);
          io.to(groupId).emit("userOffline", {
            userEmail,
            onlineCount: onlineUsers.get(groupId)?.size || 0,
          });
        }

        console.log(`User ${userEmail} left group ${groupId}`);
      });

      // Send message - UPDATED to use email
      socket.on(
        "sendMessage",
        async (data: {
          groupId: string;
          content: string;
          messageType?: "text" | "image" | "file";
        }) => {
          try {
            const userEmail = socket.data.userEmail;

            if (!userEmail) {
              socket.emit("error", { message: "Not authenticated" });
              return;
            }

            // Find userId by email
            const user = await User.findOne({ email: userEmail });
            if (!user) {
              socket.emit("error", { message: "User not found" });
              return;
            }

            const userId = user._id;

            // Verify user is member of group
            const group = await Group.findById(data.groupId);
            if (!group) {
              socket.emit("error", { message: "Group not found" });
              return;
            }

            const isMember = group.members.some(
              (m: any) => m.userId.toString() === userId.toString()
            );

            if (!isMember) {
              socket.emit("error", { message: "Not a member of this group" });
              return;
            }

            // Save message
            const message = await Message.create({
              groupId: data.groupId,
              senderId: userId,
              content: data.content,
              messageType: data.messageType || "text",
            });

            const populatedMessage = await Message.findById(message._id)
              .populate("senderId", "name email")
              .lean();

            io.to(data.groupId).emit("newMessage", populatedMessage);
            console.log(
              `Message sent to group ${data.groupId} by ${userEmail}`
            );
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Failed to send message" });
          }
        }
      );

      // Typing indicator
      socket.on("typing", (data: { groupId: string; isTyping: boolean }) => {
        const userEmail = socket.data.userEmail;
        socket.to(data.groupId).emit("userTyping", {
          userEmail,
          isTyping: data.isTyping,
        });
      });

      // Delete message - UPDATED to use email
      socket.on(
        "deleteMessage",
        async (data: { messageId: string; groupId: string }) => {
          try {
            const message = await Message.findById(data.messageId);
            if (!message) {
              socket.emit("error", { message: "Message not found" });
              return;
            }

            const userEmail = socket.data.userEmail;
            const userId = socket.data.userId;

            // Check if user is the sender or admin
            if (message.senderId.toString() !== userId) {
              // Check if user is admin
              const group = await Group.findById(data.groupId);
              const isAdmin = group?.members.some(
                (m: any) => m.userId.toString() === userId && m.role === "admin"
              );

              if (!isAdmin) {
                socket.emit("error", {
                  message: "You can only delete your own messages",
                });
                return;
              }
            }

            await Message.findByIdAndDelete(data.messageId);
            io.to(data.groupId).emit("messageDeleted", {
              messageId: data.messageId,
              groupId: data.groupId,
            });

            console.log(`Message ${data.messageId} deleted by ${userEmail}`);
          } catch (error) {
            console.error("Error deleting message:", error);
            socket.emit("error", { message: "Failed to delete message" });
          }
        }
      );

      // Handle disconnect
      socket.on("disconnect", () => {
        const userEmail = socket.data.userEmail;

        // Remove user from all online user sets
        onlineUsers.forEach((users, groupId) => {
          if (users.has(userEmail)) {
            users.delete(userEmail);
            io.to(groupId).emit("userOffline", {
              userEmail,
              onlineCount: users.size,
            });
          }
        });

        console.log(`🔴 User disconnected: ${socket.id} (${userEmail})`);
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
