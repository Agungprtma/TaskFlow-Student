// src/server.js
// Main Express server for TaskFocus Student MVP

require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// View engine setup with EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Session storage (simple in-memory store for MVP)
// In production, use proper session management
const sessions = new Map();

// Middleware to track session
app.use((req, res, next) => {
  if (!req.query.userId && !req.body.userId) {
    // Check if cookie has userId
    const sessionId = req.get("X-Session-ID");
    if (sessionId && sessions.has(sessionId)) {
      req.userId = sessions.get(sessionId).userId;
    }
  } else {
    req.userId = req.query.userId || req.body.userId;
  }
  next();
});

// Routes
const indexRoutes = require("./routes/index");
const onboardingRoutes = require("./routes/onboarding");
const dashboardRoutes = require("./routes/dashboard");
const tasksRoutes = require("./routes/tasks");
const focusRoutes = require("./routes/focus");
const waitlistRoutes = require("./routes/waitlist");
const feedbackRoutes = require("./routes/feedback");

app.use("/", indexRoutes);
app.use("/onboarding", onboardingRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/tasks", tasksRoutes);
app.use("/focus", focusRoutes);
app.use("/waitlist", waitlistRoutes);
app.use("/feedback", feedbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", { error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Start server
app.listen(PORT, () => {
  console.log(`TaskFocus Student running on http://localhost:${PORT}`);
});

module.exports = app;
