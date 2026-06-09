// src/routes/focus.js
// Focus session timer and session management routes

const express = require("express");
const router = express.Router();
const db = require("../services/database");

const GA4_ID = process.env.GA4_MEASUREMENT_ID || "G-XXXXXXXXXX";

/**
 * Calculate recommended focus session duration based on estimated hours
 * - <= 2 hours: 25 minutes (Pomodoro)
 * - 2-5 hours: 50 minutes
 * - > 5 hours: 90 minutes
 */
function getRecommendedDuration(estimatedHours) {
  if (estimatedHours <= 2) {
    return 25;
  } else if (estimatedHours <= 5) {
    return 50;
  } else {
    return 90;
  }
}

// Display focus session page
router.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).render("error", {
        error: "User ID diperlukan",
      });
    }

    // Get task
    const task = await db.getTaskById(taskId);
    if (!task) {
      return res.status(404).render("404");
    }

    // Calculate recommended duration
    const recommendedDuration = getRecommendedDuration(task.estimatedHours);

    res.render("focus-session", {
      task,
      userId,
      recommendedDuration,
      ga4_id: GA4_ID,
    });
  } catch (error) {
    console.error("Focus session error:", error);
    res.status(500).render("error", { error: error.message });
  }
});

// Start a focus session
router.post("/start", async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    if (!userId || !taskId) {
      return res.status(400).json({ error: "User ID dan Task ID diperlukan" });
    }

    // Get task to find estimated hours
    const task = await db.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Tugas tidak ditemukan" });
    }

    // Calculate recommended duration
    const recommendedDuration = getRecommendedDuration(task.estimatedHours);

    // Create focus session
    const session = await db.createFocusSession(userId, taskId, recommendedDuration);

    res.json({
      success: true,
      session,
      message: "Sesi fokus dimulai",
    });
  } catch (error) {
    console.error("Focus start error:", error);
    res.status(500).json({ error: "Gagal memulai sesi fokus" });
  }
});

// Complete focus session
router.post("/complete", async (req, res) => {
  try {
    const { sessionId, taskId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID diperlukan" });
    }

    // Complete session
    const session = await db.completeFocusSession(sessionId);

    // Update task status to "sedang_dikerjakan" if not already
    if (taskId) {
      await db.updateTaskStatus(taskId, "sedang_dikerjakan");
    }

    res.json({
      success: true,
      session,
      message: "Sesi fokus selesai! Bagus sekali!",
    });
  } catch (error) {
    console.error("Focus complete error:", error);
    res.status(500).json({ error: "Gagal menyelesaikan sesi fokus" });
  }
});

// Abandon focus session
router.post("/abandon", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID diperlukan" });
    }

    const session = await db.abandonFocusSession(sessionId);

    res.json({
      success: true,
      session,
      message: "Sesi fokus dibatalkan",
    });
  } catch (error) {
    console.error("Focus abandon error:", error);
    res.status(500).json({ error: "Gagal membatalkan sesi fokus" });
  }
});

// Get user's focus session history
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await db.getFocusSessionsByUserId(userId);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
