// src/routes/feedback.js
// Feedback submission routes

const express = require("express");
const router = express.Router();
const db = require("../services/database");

// Display feedback form
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).render("404");
    }

    res.render("feedback", { user });
  } catch (error) {
    console.error("Feedback page error:", error);
    res.status(500).render("error", { error: error.message });
  }
});

// Submit feedback
router.post("/submit", async (req, res) => {
  try {
    const {
      userId,
      relevanceScore,
      focusHelpfulnessScore,
      weeklyUsageIntent,
      improvementSuggestion,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID diperlukan" });
    }

    // Validate scores are between 1-5
    const relevance = parseInt(relevanceScore);
    const helpfulness = parseInt(focusHelpfulnessScore);

    if (
      isNaN(relevance) ||
      isNaN(helpfulness) ||
      relevance < 1 ||
      relevance > 5 ||
      helpfulness < 1 ||
      helpfulness > 5
    ) {
      return res.status(400).json({
        error: "Skor harus antara 1-5",
      });
    }

    // Save feedback
    const feedback = await db.createOrUpdateFeedback(userId, {
      relevanceScore,
      focusHelpfulnessScore,
      weeklyUsageIntent,
      improvementSuggestion,
    });

    res.json({
      success: true,
      feedback,
      message:
        "Terima kasih atas feedback Anda! Kami akan terus berinovasi berdasarkan masukan Anda.",
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({ error: "Gagal menyimpan feedback" });
  }
});

module.exports = router;
