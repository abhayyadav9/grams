import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://grams.onrender.com",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // This map stores corresponding user IDs and socket IDs


export const getReceiverSocketId =(receiverId)=> userSocketMap[receiverId]

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID ${socket.id}`);

    // Emit the updated online users list to all connected clients
    io.sockets.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.log("User connected without userId");
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User ${userId} disconnected`);

      // Emit the updated online users list to all connected clients
      io.sockets.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});




export { app, io, server };
