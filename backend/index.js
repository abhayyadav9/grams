import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";

dotenv.config({});
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/", (_, res) => {
  return res.status(200).json({
    message: "this is from server",
    success: true,
  });
});

app.use("/api/v1/user",userRoute)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  connectDB();
  console.log(`first THIS BACKEND IS RUNNING AT PORT ${port}`);
});
