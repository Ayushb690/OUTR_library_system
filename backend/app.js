import express from "express";
import { config, configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect, get } from "mongoose";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRoutes from "./routes/authRouter.js";
import bookRoutes from "./routes/bookRouter.js";
import borrowRoutes from "./routes/borrowRouter.js";

export const app = express();
config({ path: "./config/config.env" });



app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("api/v1/auth",authRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/book", bookRoutes);
app.use("/api/v1/borrow", borrowRoutes);

connectDB();

app.use(errorMiddleware);