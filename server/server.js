
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import compilerRoutes from "./routes/compilerRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// React frontend build folder
const clientDistPath = path.resolve(
  __dirname,
  "../client/dist"
);

// CORS configuration
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin, such as server-side requests.
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded files
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "uploads"))
);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "IntervueX API is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// Serve React frontend
if (existsSync(path.join(clientDistPath, "index.html"))) {
  app.use(express.static(clientDistPath));

  // React Router fallback for frontend routes
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api/") ||
        req.path.startsWith("/uploads/")) {
      return next();
    }

    res.sendFile(
      path.join(clientDistPath, "index.html"),
      (err) => {
        if (err) next(err);
      }
    );
  });
}

// Error handlers must come last
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`IntervueX server running on port ${PORT}`);
      console.log(`Frontend directory: ${clientDistPath}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
