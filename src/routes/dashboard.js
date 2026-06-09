// src/routes/dashboard.js
// Dashboard routes showing user's tasks summary and recommendations

const express = require("express");
const router = express.Router();
const db = require("../services/database");

const GA4_ID = process.env.GA4_MEASUREMENT_ID || "G-XXXXXXXXXX";

// Display dashboard
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user data
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).render("404");
    }

    // Get dashboard statistics
    const stats = await db.getDashboardStats(userId);

    // Get next recommended task
    const nextTask = await db.getNextTaskRecommendation(userId);

    res.render("dashboard", {
      user,
      stats,
      nextTask,
      ga4_id: GA4_ID,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).render("error", { error: error.message });
  }
});

// API endpoint to get dashboard stats (for AJAX updates)
router.get("/api/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await db.getDashboardStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
