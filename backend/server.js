const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const requestRoutes = require("./routes/requests");
const reviewRoutes = require("./routes/reviews");

const app = express();

// ✅ CORS (allow all for deployment)
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/reviews", reviewRoutes);

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SkillSwap API is running" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ Serve frontend in production and fallback for client-side routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res, next) => {
    if (req.method !== "GET" || req.originalUrl.startsWith("/api")) {
      return next();
    }

    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// ✅ 404 handler for API or other missing routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ✅ PORT (important for Render)
const PORT = process.env.PORT || 5000;

// ✅ MongoDB URI (FIXED)
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = app;
