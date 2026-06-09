// src/routes/onboarding.js
// User onboarding flow routes

const express = require("express");
const router = express.Router();
const db = require("../services/database");

const GA4_ID = process.env.GA4_MEASUREMENT_ID || "G-XXXXXXXXXX";

// Display onboarding form
router.get("/", (req, res) => {
  res.render("onboarding", { ga4_id: GA4_ID });
});

// Save onboarding data and redirect to dashboard
router.post("/submit", async (req, res) => {
  try {
    const {
      name,
      email,
      educationLevel,
      semester,
      studyProgram,
      avgTasksPerWeek,
      mainPainPoint,
    } = req.body;

    // Validate required fields
    if (!name || !email || !educationLevel || !semester || !studyProgram) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    // Check if email already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      // Redirect to dashboard with existing user
      return res.json({
        success: true,
        userId: existingUser.id,
        message: "Selamat datang kembali!",
      });
    }

    // Create new user
    const user = await db.createUser({
      name,
      email,
      educationLevel,
      semester,
      studyProgram,
      avgTasksPerWeek: avgTasksPerWeek || 5,
      mainPainPoint: mainPainPoint || "umum",
    });

    res.json({
      success: true,
      userId: user.id,
      message: "Onboarding berhasil! Mari mulai kelola tugas.",
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ error: "Gagal menyimpan data onboarding" });
  }
});

module.exports = router;
