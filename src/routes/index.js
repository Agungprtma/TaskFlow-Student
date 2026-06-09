// src/routes/index.js
// Landing page and homepage routes

const express = require("express");
const router = express.Router();

// GA4 Measurement ID from environment
const GA4_ID = process.env.GA4_MEASUREMENT_ID || "G-XXXXXXXXXX";

// Landing page
router.get("/", (req, res) => {
  res.render("landing", { ga4_id: GA4_ID });
});

// Waitlist form on landing (alternative route)
router.post("/waitlist-quick", async (req, res) => {
  try {
    const { name, email } = req.body;
    // Validation
    if (!name || !email) {
      return res.json({ error: "Nama dan email diperlukan" });
    }

    const db = require("../services/database");
    await db.addToWaitlist(name, email, "undecided");

    res.json({
      success: true,
      message: "Terima kasih, kami akan menghubungimu segera!",
    });
  } catch (error) {
    console.error(error);
    res.json({
      error: "Terjadi kesalahan saat menyimpan data",
    });
  }
});

module.exports = router;
