import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON body
app.use(express.json({ limit: "1mb" }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SNJ Mining Backend is running.",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// API Root
app.get("/api", (req, res) => {
  res.json({
    success: true,
    name: "SNJ Mining API",
    version: "1.0.0",
    status: "online",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(error.status || 500).json({
    success: false,
    message:
      error.message || "Internal server error.",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(
    `SNJ Mining Backend running on port ${PORT}`
  );
});
