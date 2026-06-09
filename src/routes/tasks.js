// src/routes/tasks.js
// Task management routes (CRUD operations and task board)

const express = require("express");
const router = express.Router();
const db = require("../services/database");

const GA4_ID = process.env.GA4_MEASUREMENT_ID || "G-XXXXXXXXXX";

// Display task board for user
router.get("/board/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).render("404");
    }

    // Get all tasks
    const tasks = await db.getTasksByUserId(userId);

    // Categorize tasks by status
    const tasksByStatus = {
      belum_mulai: tasks.filter((t) => t.status === "belum_mulai"),
      sedang_dikerjakan: tasks.filter((t) => t.status === "sedang_dikerjakan"),
      selesai: tasks.filter((t) => t.status === "selesai"),
    };

    res.render("task-board", {
      user,
      tasksByStatus,
      ga4_id: GA4_ID,
    });
  } catch (error) {
    console.error("Task board error:", error);
    res.status(500).render("error", { error: error.message });
  }
});

// Display add task form
router.get("/new/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).render("404");
    }

    res.render("add-task", { user, ga4_id: GA4_ID });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// Create new task
router.post("/create", async (req, res) => {
  try {
    const { userId, ...taskData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID diperlukan" });
    }

    // Validate required fields
    const required = [
      "title",
      "courseName",
      "deadline",
      "difficultyLevel",
      "estimatedHours",
      "importanceLevel",
    ];
    for (const field of required) {
      if (!taskData[field]) {
        return res.status(400).json({ error: `${field} diperlukan` });
      }
    }

    // Create task
    const task = await db.createTask(userId, taskData);

    res.json({
      success: true,
      task,
      message: "Tugas berhasil ditambahkan!",
    });
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ error: "Gagal membuat tugas" });
  }
});

// Get all tasks for user (API)
router.get("/list/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await db.getTasksByUserId(userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single task details
router.get("/detail/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await db.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Tugas tidak ditemukan" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status (used by drag and drop)
router.patch("/status/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newStatus } = req.body;

    // Validate status
    const validStatuses = ["belum_mulai", "sedang_dikerjakan", "selesai"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Status tidak valid" });
    }

    // Update task
    const task = await db.updateTaskStatus(taskId, newStatus);

    res.json({
      success: true,
      task,
      message: `Status tugas berubah menjadi ${newStatus}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    await db.deleteTask(taskId);

    res.json({
      success: true,
      message: "Tugas berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
