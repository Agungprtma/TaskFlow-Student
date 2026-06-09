# Priority Scoring Engine Documentation

## Overview

The Priority Scoring Engine adalah sistem otomatis yang menentukan prioritas tugas akademik berdasarkan multiple factors. Engine ini dirancang untuk membantu mahasiswa mengidentifikasi tugas mana yang harus dikerjakan terlebih dahulu, sehingga mereka dapat mengelola waktu dan energi dengan lebih efektif.

## Scoring Algorithm

### Total Score Range

- **Minimum**: 0 points
- **Maximum**: 140 points

### Scoring Components

#### 1. Deadline Factor (0-40 points)

Mengukur urgensi tugas berdasarkan jarak waktu ke deadline.

| Deadline Range | Points | Urgency Level |
| --- | --- | --- |
| 0-1 hari | 40 | Sangat Mendesak |
| 2-3 hari | 30 | Mendesak |
| 4-7 hari | 20 | Perlu Dijadwalkan |
| >7 hari | 10 | Ada Waktu |

**Formula**: Semakin dekat deadline, semakin tinggi skor.

**Use Case**: Tugas dengan deadline besok akan mendapat 40 poin, sementara tugas dengan deadline 2 minggu hanya mendapat 10 poin.

#### 2. Difficulty Factor (0-30 points)

Mengukur kompleksitas dan tingkat kesulitan tugas.

| Difficulty Level | Points | Description |
| --- | --- | --- |
| Tinggi | 30 | Memerlukan pemahaman mendalam, banyak komponen kompleks |
| Sedang | 20 | Memerlukan usaha normal, beberapa elemen menantang |
| Rendah | 10 | Relatif mudah, dapat diselesaikan dengan cepat |

**Rationale**: Tugas yang lebih sulit memerlukan lebih banyak persiapan dan fokus, sehingga sebaiknya dikerjakan lebih awal.

#### 3. Importance Factor (0-30 points)

Mengukur pentingnya tugas dalam konteks akademik.

| Importance Level | Points | Description |
| --- | --- | --- |
| Tinggi | 30 | Mempengaruhi nilai akhir significant, presentasi, ujian komprehensif |
| Sedang | 20 | Tugas regular, Quiz, PR yang dinilai |
| Rendah | 10 | Tugas optional, reading assignment, diskusi forum |

**Rationale**: Tugas yang lebih penting untuk nilai akademik harus mendapat prioritas lebih tinggi.

#### 4. Estimated Hours Factor (0-20 points)

Mengukur berapa banyak waktu yang dibutuhkan untuk menyelesaikan tugas.

| Estimated Hours | Points | Purpose |
| --- | --- | --- |
| >5 jam | 20 | Tugas besar perlu direncanakan lebih awal |
| 2-5 jam | 10 | Tugas medium memerlukan persiapan |
| <2 jam | 5 | Tugas kecil bisa dilakukan lebih fleksibel |

**Rationale**: Tugas yang memakan waktu lebih lama harus dimulai lebih awal untuk menghindari deadline crunch.

### Scoring Example

**Contoh 1: Tugas Prioritas Tinggi**

```
Tugas: Laporan Akhir Proyek Web
- Deadline: 2 hari → 30 points
- Difficulty: Tinggi → 30 points
- Importance: Tinggi → 30 points
- Estimated Hours: 6 jam → 20 points
───────────────────────────
Total Score: 110 points → Prioritas Tinggi
Category: ≥90
```

**Contoh 2: Tugas Prioritas Sedang**

```
Tugas: Quiz Statistik
- Deadline: 5 hari → 20 points
- Difficulty: Sedang → 20 points
- Importance: Sedang → 20 points
- Estimated Hours: 2 jam → 5 points
───────────────────────────
Total Score: 65 points → Prioritas Sedang
Category: 60-89
```

**Contoh 3: Tugas Prioritas Rendah**

```
Tugas: Membaca Chapter 5 Buku
- Deadline: 14 hari → 10 points
- Difficulty: Rendah → 10 points
- Importance: Rendah → 10 points
- Estimated Hours: 1.5 jam → 5 points
───────────────────────────
Total Score: 35 points → Prioritas Rendah
Category: <60
```

## Priority Categories

### 1. Prioritas Tinggi (Score ≥ 90)

**Characteristics**:
- Deadline sangat dekat atau sudah urgent
- Tingkat kesulitan tinggi
- Penting untuk nilai akademik
- Memerlukan waktu signifikan

**Recommended Actions**:
- Kerjakan hari ini atau besok
- Pecah menjadi beberapa sesi fokus
- Mulai dari bagian paling sulit terlebih dahulu
- Siapkan resource dan bahan referensi

### 2. Prioritas Sedang (Score 60-89)

**Characteristics**:
- Deadline moderat (dalam beberapa hari)
- Tingkat kesulitan medium
- Cukup penting untuk akademik
- Memerlukan waktu normal

**Recommended Actions**:
- Jadwalkan untuk 2-3 hari ke depan
- Alokasikan satu atau dua sesi fokus
- Review materi pendukung jika diperlukan

### 3. Prioritas Rendah (Score < 60)

**Characteristics**:
- Deadline masih lama
- Tingkat kesulitan rendah
- Tidak urgent untuk nilai akademik
- Dapat diselesaikan dengan cepat

**Recommended Actions**:
- Tugas ini belum mendesak, tetapi tetap perlu dijadwalkan
- Bisa dilakukan sebagai buffer atau top-up activity
- Gunakan sebagai break dari tugas prioritas tinggi

## Implementation Details

- **File**: `src/services/priorityScoring.js`
- **Functions**: `calculatePriorityScore`, `getPriorityCategory`, `generatePriorityReason`, `generateActionRecommendation`
- **Integration**: Task creation, display, and dashboard recommendations
