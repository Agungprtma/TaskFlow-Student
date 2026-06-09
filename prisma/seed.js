/**
 * TASKFOCUS STUDENT - DATABASE SEED
 * Populate database with dummy data for testing and development
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create sample user
    const user = await prisma.user.create({
      data: {
        name: 'Budi Santoso',
        email: 'budi@university.edu',
        educationLevel: 'S1',
        semester: 5,
        studyProgram: 'Teknik Informatika',
        avgTasksPerWeek: 8,
        mainPainPoint: 'Sulit menentukan prioritas',
      },
    });

    console.log(`✅ Created user: ${user.name} (${user.email})`);

    // Create sample tasks with different priorities
    const tasks = await Promise.all([
      prisma.task.create({
        data: {
          userId: user.id,
          title: 'Membuat Laporan Akhir Proyek Web Development',
          courseName: 'Web Development',
          deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
          difficultyLevel: 'high',
          estimatedHours: 6,
          importanceLevel: 'high',
          priorityScore: 125,
          priorityCategory: 'Prioritas Tinggi',
          priorityReason:
            'Tugas ini masuk prioritas tinggi karena deadline sudah dekat (2 hari), tingkat kesulitan tinggi, dan estimasi waktu pengerjaan cukup besar (6 jam).',
          actionRecommendation:
            'Mulai hari ini dan pecah menjadi 2 sesi fokus 3 jam. Mulai dari bagian paling sulit terlebih dahulu.',
          status: 'not_started',
        },
      }),

      prisma.task.create({
        data: {
          userId: user.id,
          title: 'Quiz Online Statistik',
          courseName: 'Statistik Terapan',
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
          difficultyLevel: 'medium',
          estimatedHours: 3,
          importanceLevel: 'medium',
          priorityScore: 75,
          priorityCategory: 'Prioritas Sedang',
          priorityReason:
            'Tugas ini memiliki prioritas sedang karena deadline 5 hari, tingkat kesulitan sedang, dan estimasi waktu 3 jam.',
          actionRecommendation:
            'Jadwalkan untuk dikerjakan dalam 2-3 hari ke depan dengan sesi 1-2 jam.',
          status: 'not_started',
        },
      }),

      prisma.task.create({
        data: {
          userId: user.id,
          title: 'Membaca Bab 5-7 Buku Algoritma',
          courseName: 'Struktur Data dan Algoritma',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          difficultyLevel: 'low',
          estimatedHours: 2,
          importanceLevel: 'medium',
          priorityScore: 50,
          priorityCategory: 'Prioritas Rendah',
          priorityReason:
            'Tugas ini memiliki prioritas rendah karena deadline masih lama (14 hari), meski tingkat kepentingan akademik sedang.',
          actionRecommendation:
            'Tugas ini belum mendesak, tetapi tetap perlu dijadwalkan. Bisa dikerjakan dalam satu sesi 2 jam minggu depan.',
          status: 'not_started',
        },
      }),

      prisma.task.create({
        data: {
          userId: user.id,
          title: 'Presentasi Kelompok Sosiologi',
          courseName: 'Sosiologi Industri',
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
          difficultyLevel: 'medium',
          estimatedHours: 4,
          importanceLevel: 'high',
          priorityScore: 100,
          priorityCategory: 'Prioritas Tinggi',
          priorityReason:
            'Deadline 3 hari, tingkat kesulitan sedang, dan kepentingan tinggi karena bersifat presentasi kelompok yang akan dinilai langsung.',
          actionRecommendation:
            'Mulai koordinasi dengan kelompok hari ini. Lakukan sesi fokus 2 jam untuk persiapan.',
          status: 'in_progress',
        },
      }),

      prisma.task.create({
        data: {
          userId: user.id,
          title: 'Tugas Praktikum Database - Query Kompleks',
          courseName: 'Basis Data',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          difficultyLevel: 'high',
          estimatedHours: 5,
          importanceLevel: 'high',
          priorityScore: 105,
          priorityCategory: 'Prioritas Tinggi',
          priorityReason:
            'Deadline 7 hari, tingkat kesulitan tinggi, kepentingan tinggi, dan estimasi waktu besar (5 jam).',
          actionRecommendation:
            'Mulai dari query paling sederhana. Pecah menjadi 2-3 sesi fokus 90 menit.',
          status: 'not_started',
        },
      }),
    ]);

    console.log(`✅ Created ${tasks.length} sample tasks`);

    // Create sample focus sessions
    const focusSessions = await Promise.all([
      prisma.focusSession.create({
        data: {
          userId: user.id,
          taskId: tasks[0].id,
          recommendedDuration: 50,
          startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          endedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          status: 'completed',
        },
      }),

      prisma.focusSession.create({
        data: {
          userId: user.id,
          taskId: tasks[3].id,
          recommendedDuration: 50,
          startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
          endedAt: null,
          status: 'abandoned',
        },
      }),
    ]);

    console.log(`✅ Created ${focusSessions.length} sample focus sessions`);

    // Create sample waitlist entries
    const waitlistEntries = await Promise.all([
      prisma.waitlist.create({
        data: {
          name: 'Siti Nurhaliza',
          email: 'siti.nurhaliza@email.com',
          preferredFeature: 'reminder_deadline',
        },
      }),

      prisma.waitlist.create({
        data: {
          name: 'Ahmad Rizki',
          email: 'ahmad.rizki@email.com',
          preferredFeature: 'ai_recommendation',
        },
      }),

      prisma.waitlist.create({
        data: {
          name: 'Dewi Lestari',
          email: 'dewi.lestari@email.com',
          preferredFeature: 'productivity_dashboard',
        },
      }),
    ]);

    console.log(`✅ Created ${waitlistEntries.length} waitlist entries`);

    // Create sample feedback
    const feedbackEntries = await Promise.all([
      prisma.feedback.create({
        data: {
          userId: user.id,
          relevanceScore: 5,
          focusHelpfulnessScore: 4,
          weeklyUsageIntent: 'yes',
          improvementSuggestion:
            'Tambahkan fitur untuk berbagi progress dengan teman sekelas.',
        },
      }),

      prisma.feedback.create({
        data: {
          userId: user.id,
          relevanceScore: 4,
          focusHelpfulnessScore: 5,
          weeklyUsageIntent: 'maybe',
          improvementSuggestion:
            'Fitur reminder deadline akan sangat membantu saya.',
        },
      }),
    ]);

    console.log(`✅ Created ${feedbackEntries.length} feedback entries`);

    console.log('\n✨ Database seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 user created`);
    console.log(`   - ${tasks.length} tasks created`);
    console.log(`   - ${focusSessions.length} focus sessions created`);
    console.log(`   - ${waitlistEntries.length} waitlist entries created`);
    console.log(`   - ${feedbackEntries.length} feedback entries created`);

    console.log('\n💡 Quick start:');
    console.log(`   - User Email: ${user.email}`);
    console.log(`   - Dashboard URL: /dashboard?userId=${user.id}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
