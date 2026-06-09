// src/services/database.js
// Database operations service using Prisma

const { PrismaClient } = require("@prisma/client");
const priorityScoring = require("./priorityScoring");

const prisma = new PrismaClient();

// User operations
async function createUser(userData) {
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      educationLevel: userData.educationLevel,
      semester: parseInt(userData.semester),
      studyProgram: userData.studyProgram,
      avgTasksPerWeek: parseInt(userData.avgTasksPerWeek),
      mainPainPoint: userData.mainPainPoint,
    },
  });
}

async function getUserById(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      tasks: true,
      focusSessions: true,
    },
  });
}

async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Task operations
async function createTask(userId, taskData) {
  const taskInput = {
    userId,
    title: taskData.title,
    courseName: taskData.courseName,
    deadline: new Date(taskData.deadline),
    difficultyLevel: taskData.difficultyLevel,
    estimatedHours: parseFloat(taskData.estimatedHours),
    importanceLevel: taskData.importanceLevel,
    status: "belum_mulai",
  };

  // Calculate priority
  const priority = priorityScoring.calculateTaskPriority(taskInput);

  taskInput.priorityScore = priority.score;
  taskInput.priorityCategory = priority.category;
  taskInput.priorityReason = priority.reason;
  taskInput.actionRecommendation = priority.recommendation;

  return prisma.task.create({
    data: taskInput,
  });
}

async function getTasksByUserId(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { priorityScore: "desc" },
  });
}

async function getTaskById(taskId) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      focusSessions: true,
    },
  });
}

async function updateTaskStatus(taskId, newStatus) {
  return prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
}

async function deleteTask(taskId) {
  return prisma.task.delete({
    where: { id: taskId },
  });
}

// Focus session operations
async function createFocusSession(userId, taskId, recommendedDuration) {
  return prisma.focusSession.create({
    data: {
      userId,
      taskId,
      recommendedDuration,
      startedAt: new Date(),
      status: "in_progress",
    },
  });
}

async function completeFocusSession(sessionId) {
  return prisma.focusSession.update({
    where: { id: sessionId },
    data: {
      endedAt: new Date(),
      status: "completed",
    },
  });
}

async function abandonFocusSession(sessionId) {
  return prisma.focusSession.update({
    where: { id: sessionId },
    data: {
      endedAt: new Date(),
      status: "abandoned",
    },
  });
}

async function getFocusSessionsByUserId(userId) {
  return prisma.focusSession.findMany({
    where: { userId },
    include: {
      task: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// Waitlist operations
async function addToWaitlist(name, email, preferredFeature) {
  return prisma.waitlist.create({
    data: {
      name,
      email,
      preferredFeature,
    },
  });
}

// Feedback operations
async function createOrUpdateFeedback(userId, feedbackData) {
  const existingFeedback = await prisma.feedback.findUnique({
    where: { userId },
  });

  if (existingFeedback) {
    return prisma.feedback.update({
      where: { userId },
      data: {
        relevanceScore: parseInt(feedbackData.relevanceScore),
        focusHelpfulnessScore: parseInt(feedbackData.focusHelpfulnessScore),
        weeklyUsageIntent: feedbackData.weeklyUsageIntent,
        improvementSuggestion: feedbackData.improvementSuggestion,
      },
    });
  }

  return prisma.feedback.create({
    data: {
      userId,
      relevanceScore: parseInt(feedbackData.relevanceScore),
      focusHelpfulnessScore: parseInt(feedbackData.focusHelpfulnessScore),
      weeklyUsageIntent: feedbackData.weeklyUsageIntent,
      improvementSuggestion: feedbackData.improvementSuggestion,
    },
  });
}

// Dashboard statistics
async function getDashboardStats(userId) {
  const tasks = await prisma.task.findMany({
    where: { userId },
  });

  const completedTasks = tasks.filter((t) => t.status === "selesai");
  const highPriorityTasks = tasks.filter((t) => t.priorityCategory === "prioritas_tinggi");
  const focusSessions = await prisma.focusSession.findMany({
    where: { userId },
  });

  const completedSessions = focusSessions.filter((s) => s.status === "completed");

  const upcomingDeadlines = tasks
    .filter((t) => t.status !== "selesai")
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return {
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    remainingTasks: tasks.length - completedTasks.length,
    highPriorityTasks: highPriorityTasks.length,
    completionRate,
    totalFocusSessions: focusSessions.length,
    completedFocusSessions: completedSessions.length,
    upcomingDeadlines,
  };
}

// Recommendation logic
async function getNextTaskRecommendation(userId) {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: { in: ["belum_mulai", "sedang_dikerjakan"] },
    },
    orderBy: { priorityScore: "desc" },
    take: 1,
  });

  return tasks[0] || null;
}

module.exports = {
  // User
  createUser,
  getUserById,
  getUserByEmail,
  // Task
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTaskStatus,
  deleteTask,
  // Focus Session
  createFocusSession,
  completeFocusSession,
  abandonFocusSession,
  getFocusSessionsByUserId,
  // Waitlist
  addToWaitlist,
  // Feedback
  createOrUpdateFeedback,
  // Dashboard
  getDashboardStats,
  getNextTaskRecommendation,
};
