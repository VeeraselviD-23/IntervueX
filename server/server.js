
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

// Resolve current file and directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Expected production frontend build directory
const clientDistPath = path.resolve(
  __dirname,
  "../client/dist"
);

const frontendIndexPath = path.join(
  clientDistPath,
  "index.html"
);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",").map((origin) =>
          origin.trim().replace(/\/+$/, "")
        )
      : true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Resume uploads
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "uploads"))
);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "IntervueX API is running",
  });
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

// Serve the built React frontend
if (existsSync(frontendIndexPath)) {
  app.use(express.static(clientDistPath));

  // React Router fallback for frontend routes
  app.get("/{*path}", (req, res, next) => {
    // Unknown API routes must reach the API 404 handler
    if (req.path === "/api" || req.path.startsWith("/api/")) {
      return next();
    }

    res.sendFile(frontendIndexPath, (err) => {
      if (err) {
        next(err);
      }
    });
  });

  console.log("Frontend build found:", frontendIndexPath);
} else {
  console.error(
    "Frontend build not found:",
    frontendIndexPath
  );

  // Avoid silently returning the API 404 for the homepage
  app.get("/", (req, res) => {
    res.status(503).json({
      success: false,
      message:
        "Frontend build is missing. Check the Render build command.",
    });
  });
}

// 404 and error handlers must remain last
app.use(notFound);
app.use(errorHandler);

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`IntervueX server running on port ${PORT}`);
      console.log(`Frontend directory: ${clientDistPath}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
