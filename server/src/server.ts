import path from "path";
import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import fileRoutes from "./routes/fileRoutes";
import contactRoutes from "./routes/contactRoutes";

// Load environment variables
dotenv.config();

const app: Application = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/contact", contactRoutes);

app.listen(port, () => {
  console.log(`Server is up and listening on port ${port}`);
});
