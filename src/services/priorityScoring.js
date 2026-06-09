// src/services/priorityScoring.js
// Priority Scoring Engine for TaskFocus Student
// Calculates task priority based on deadline, difficulty, importance, and estimated time

/**
 * Calculate priority score for a task
 * Score ranges from 0-140 points
 *
 * Scoring Rules:
 * - Deadline: 0-1 hari = +40, 2-3 hari = +30, 4-7 hari = +20, >7 hari = +10
 * - Difficulty: tinggi = +30, sedang = +20, rendah = +10
 * - Importance: tinggi = +30, sedang = +20, rendah = +10
 * - Estimated Time: >5 jam = +20, 2-5 jam = +10, <2 jam = +5
 */
function calculatePriorityScore(task) {
  let score = 0;

  // Calculate days until deadline
  const now = new Date();
  const deadline = new Date(task.deadline);
  const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  // Deadline scoring
  if (daysUntilDeadline <= 1) {
    score += 40;
  } else if (daysUntilDeadline <= 3) {
    score += 30;
  } else if (daysUntilDeadline <= 7) {
    score += 20;
  } else {
    score += 10;
  }

  // Difficulty level scoring
  switch (task.difficultyLevel) {
    case "tinggi":
      score += 30;
      break;
    case "sedang":
      score += 20;
      break;
    case "rendah":
      score += 10;
      break;
  }

  // Importance level scoring
  switch (task.importanceLevel) {
    case "tinggi":
      score += 30;
      break;
    case "sedang":
      score += 20;
      break;
    case "rendah":
      score += 10;
      break;
  }

  // Estimated hours scoring
  if (task.estimatedHours > 5) {
    score += 20;
  } else if (task.estimatedHours >= 2) {
    score += 10;
  } else {
    score += 5;
  }

  return Math.min(score, 140); // Cap at 140
}

/**
 * Determine priority category based on score
 * - prioritas_tinggi: score >= 90
 * - prioritas_sedang: score 60-89
 * - prioritas_rendah: score < 60
 */
function getPriorityCategory(score) {
  if (score >= 90) {
    return "prioritas_tinggi";
  } else if (score >= 60) {
    return "prioritas_sedang";
  } else {
    return "prioritas_rendah";
  }
}

/**
 * Generate natural language explanation for why task has certain priority
 * Returns readable Indonesian text explaining the scoring factors
 */
function generatePriorityReason(task, score) {
  const reasons = [];
  const now = new Date();
  const deadline = new Date(task.deadline);
  const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  // Deadline reason
  if (daysUntilDeadline <= 1) {
    reasons.push("deadline sudah sangat dekat");
  } else if (daysUntilDeadline <= 3) {
    reasons.push("deadline cukup dekat");
  } else if (daysUntilDeadline <= 7) {
    reasons.push("deadline dalam seminggu");
  }

  // Difficulty reason
  if (task.difficultyLevel === "tinggi") {
    reasons.push("tingkat kesulitan tinggi");
  } else if (task.difficultyLevel === "sedang") {
    reasons.push("tingkat kesulitan sedang");
  }

  // Importance reason
  if (task.importanceLevel === "tinggi") {
    reasons.push("tingkat kepentingan tinggi");
  }

  // Time estimate reason
  if (task.estimatedHours > 5) {
    reasons.push("estimasi waktu pengerjaan cukup besar");
  }

  // Build sentence
  if (reasons.length === 0) {
    return "Tugas ini belum mendesak, tetapi tetap perlu dijadwalkan.";
  }

  const reasonText = reasons.join(", ");
  const priorityCategory = getPriorityCategory(score);

  if (priorityCategory === "prioritas_tinggi") {
    return `Tugas ini masuk prioritas tinggi karena ${reasonText}.`;
  } else if (priorityCategory === "prioritas_sedang") {
    return `Tugas ini masuk prioritas sedang karena ${reasonText}.`;
  } else {
    return `Tugas ini masuk prioritas rendah, tetapi tetap perlu diperhatikan karena ${reasonText || "memiliki deadline tertentu"}.`;
  }
}

/**
 * Generate action recommendation based on priority category and time estimate
 * Helps user decide how to tackle the task
 */
function generateActionRecommendation(task, score) {
  const priorityCategory = getPriorityCategory(score);
  const now = new Date();
  const deadline = new Date(task.deadline);
  const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  if (priorityCategory === "prioritas_tinggi") {
    if (daysUntilDeadline <= 1) {
      return "Kerjakan hari ini. Pertimbangkan membagi menjadi beberapa sesi fokus.";
    } else if (task.estimatedHours > 5) {
      return "Pecah menjadi beberapa sesi fokus dan mulai sekarang jika memungkinkan.";
    } else {
      return "Prioritaskan hari ini atau besok untuk memastikan selesai tepat waktu.";
    }
  } else if (priorityCategory === "prioritas_sedang") {
    if (task.estimatedHours > 5) {
      return "Mulai dari bagian paling sulit terlebih dahulu dan pecah menjadi sesi-sesi kecil.";
    } else {
      return "Rencanakan untuk diselesaikan dalam 1-2 hari ke depan.";
    }
  } else {
    return "Tugas ini masih memiliki waktu, tetapi jadwalkan dalam minggu ini agar tidak tertinggal.";
  }
}

/**
 * Complete priority calculation for a task
 * Returns object with score, category, reason, and recommendation
 */
function calculateTaskPriority(task) {
  const score = calculatePriorityScore(task);
  const category = getPriorityCategory(score);
  const reason = generatePriorityReason(task, score);
  const recommendation = generateActionRecommendation(task, score);

  return {
    score,
    category,
    reason,
    recommendation,
  };
}

module.exports = {
  calculatePriorityScore,
  getPriorityCategory,
  generatePriorityReason,
  generateActionRecommendation,
  calculateTaskPriority,
};
