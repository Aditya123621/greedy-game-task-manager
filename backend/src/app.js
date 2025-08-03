import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

export { app };
