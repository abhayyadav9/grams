import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js"; // Ensure this is correct
import postRoute from "./routes/post.route.js";
import path from "path";

dotenv.config();

const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: "https://grams.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.get("/", (_, res) => {
  return res.status(200).json({
    message: "This is from server",
    success: true,
  });
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/post", postRoute);

// Serve static files
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Start server
const port = process.env.PORT || 5000;

server.listen(port, () => {
  connectDB(); // Ensure this function connects to your database
  console.log(`Backend is running at port ${port}`);
});
