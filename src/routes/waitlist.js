// src/routes/waitlist.js
// Waitlist signup routes

const express = require("express");
const router = express.Router();
const db = require("../services/database");

// Display waitlist page
router.get("/", (req, res) => {
  res.render("waitlist");
});

// Submit to waitlist
router.post("/submit", async (req, res) => {
  try {
    const { name, email, preferredFeature } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: "Nama dan email wajib diisi" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format email tidak valid" });
    }

    // Add to waitlist
    await db.addToWaitlist(name, email, preferredFeature || "undecided");

    res.json({
      success: true,
      message:
        "Terima kasih telah bergabung dengan waitlist kami! Kami akan segera menghubungimu.",
    });
  } catch (error) {
    // Check if email already exists
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Email ini sudah terdaftar di waitlist",
      });
    }

    console.error("Waitlist error:", error);
    res.status(500).json({ error: "Gagal menyimpan data waitlist" });
  }
});

module.exports = router;
