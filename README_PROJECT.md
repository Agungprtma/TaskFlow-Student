# TaskFocus Student 🎓

**Platform Produktivitas Akademik untuk Mahasiswa Indonesia**

TaskFocus Student adalah MVP web application yang membantu mahasiswa mengelola tugas kuliah, menentukan prioritas pengerjaan secara otomatis, dan menjaga fokus belajar dengan lebih terstruktur.

## 🎯 Product Overview

### What is TaskFocus Student?

TaskFocus Student menggabungkan:
- **Task Management**: Mencatat dan mengelola semua tugas kuliah
- **Priority Scoring**: Sistem otomatis menentukan prioritas berdasarkan deadline, kesulitan, dan kepentingan
- **Task Board**: Kanban-style board dengan drag-and-drop untuk visualisasi workflow
- **Focus Timer**: Sesi fokus terjadwal dengan rekomendasi durasi
- **Analytics**: Tracking produktivitas dan engagement

### Problem We Solve

Mahasiswa sering menghadapi:
- ❌ Banyak deadline yang saling berdekatan
- ❌ Kesulitan menentukan tugas mana yang dikerjakan dulu
- ❌ Distraksi digital saat belajar
- ❌ Tidak terukur progress dan produktivitas

## ✨ Core Features

### 1. Landing Page
- Modern hero section dengan value proposition jelas
- Sections: Problem, Solution, How It Works, Features
- CTA buttons untuk memulai dan join waitlist
- Privacy notice transparan

### 2. User Onboarding
- Simple profile setup (nama, email, semester, program studi)
- Identify main pain points
- Saves user data to PostgreSQL

### 3. Dashboard
- Summary widgets: Total tasks, completion rate, high priority count
- Upcoming deadlines
- Top recommendations untuk tugas apa yang harus dikerjakan
- Quick action buttons

### 4. Task Management
- Add, edit, view, delete tasks
- Fields: title, course, deadline, difficulty, estimated hours, importance
- Automatic priority scoring (0-140 points)
- 3-level priority categories: High, Medium, Low

### 5. Kanban Task Board
- 3 columns: Belum Mulai, Sedang Dikerjakan, Selesai
- Task cards with drag-and-drop support
- Shows priority badge, deadline, estimated hours
- Real-time status updates

### 6. Focus Session Timer
- Click "Mulai Sesi Fokus" on any task
- Recommended duration based on estimated hours
- Start/pause/reset/complete controls
- Tracks session data (started, ended, status)

### 7. Feedback & Waitlist
- Collect user feedback on priority recommendations
- Waitlist for product updates
- Both triggered with GA4 events

### 8. Google Analytics 4
- 13+ events tracked
- User journey from landing → signup → task create → focus session → feedback
- Custom dimensions for user demographics

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Frontend**: EJS templates + HTML + CSS + Vanilla JavaScript
- **Analytics**: Google Analytics 4 (gtag)
- **Drag & Drop**: Native HTML5 Drag and Drop API

## 📦 Installation

### Prerequisites
- Node.js 14+ and npm 6+
- PostgreSQL 12+

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/Agungprtma/TaskFlow-Student.git
cd TaskFlow-Student

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database URL and GA4 ID

# 4. Setup database
npm run db:setup

# 5. Start development server
npm run dev

# 6. Open browser
# Navigate to http://localhost:3000
```

## 📚 Documentation

- **[Setup Guide](./docs/SETUP_GUIDE.md)** - Detailed installation and configuration
- **[Priority Scoring](./docs/PRIORITY_SCORING.md)** - How priority algorithm works
- **[GA4 Events](./docs/GA4_EVENTS.md)** - Analytics tracking documentation
- **[API Routes](./docs/API_ROUTES.md)** - Complete API endpoint reference

## 🎮 Usage

### For Users

1. **Visit landing page** → http://localhost:3000
2. **Click "Mulai Atur Prioritas"** → Fill onboarding form
3. **Add tasks** → Click "Tambah Tugas" on dashboard
4. **View priority scores** → Tasks automatically scored 0-140 points
5. **Drag tasks** → Move between columns on task board
6. **Start focus session** → Timer for focused work
7. **Track progress** → Dashboard shows completion rate and stats

### For Developers

#### View database
```bash
npm run db:studio
# Opens http://localhost:5555 with GUI
```

#### Add sample data
```bash
npm run db:seed
# Populates with dummy users, tasks, focus sessions
```

#### Create new task migration
```bash
# After modifying prisma/schema.prisma
npm run db:migrate
# Create migration name when prompted
```

## 📊 Priority Scoring Algorithm

Tasks are scored 0-140 points based on:

| Factor | Points | Calculation |
| --- | --- | --- |
| **Deadline** | 0-40 | 0-1 hari=40, 2-3=30, 4-7=20, >7=10 |
| **Difficulty** | 0-30 | Tinggi=30, Sedang=20, Rendah=10 |
| **Importance** | 0-30 | Tinggi=30, Sedang=20, Rendah=10 |
| **Estimated Hours** | 0-20 | >5=20, 2-5=10, <2=5 |

**Categories**:
- ✅ **Prioritas Tinggi** (≥90) - Do today
- 🟡 **Prioritas Sedang** (60-89) - Schedule in 2-3 days
- ⚪ **Prioritas Rendah** (<60) - Flexible timing

Example: Task dengan deadline 2 hari + difficulty tinggi + importance tinggi + 6 jam = **110 points → Prioritas Tinggi**

## 📈 Analytics Funnel

Tracked user journey:

```
Landing Page View
    ↓
CTA Click
    ↓
Onboarding Submit
    ↓
Task Create
    ↓
Task Status Update
    ↓
Focus Session Start
    ↓
Focus Session Complete
    ↓
Feedback Submit
```

## 🗂️ Project Structure

```
TaskFlow-Student/
├── src/
│   ├── server.js                  # Express setup
│   ├── services/
│   │   ├── priorityScoring.js     # Algorithm
│   │   └── database.js            # DB operations
│   └── routes/                    # All API routes
├── views/                          # EJS templates
├── public/
│   ├── css/styles.css             # Styling
│   └── js/                        # Frontend logic
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.js                    # Sample data
├── docs/                          # Documentation
├── .env.example                   # Config template
└── package.json
```

## 🚀 Available Commands

```bash
npm run dev              # Start development server (with auto-reload)
npm start               # Start production server
npm run db:migrate      # Run database migrations
npm run db:seed         # Populate with sample data
npm run db:studio       # Open Prisma Studio GUI
npm run db:reset        # Reset database (dev only)
```

## 🔐 Privacy & Data

TaskFocus Student:
- ✅ Only collects data needed for task management and analytics
- ✅ No passwords or sensitive academic data
- ✅ No access to campus systems
- ✅ All data stored locally or on configured server
- ✅ Transparent about GA4 tracking

See privacy notice in footer of landing page.

## 🐛 Troubleshooting

### Port already in use?
```bash
PORT=3001 npm run dev
```

### Database connection error?
```bash
# Verify PostgreSQL running and DATABASE_URL correct
npm run db:reset
```

### Drag-and-drop not working?
- Check browser console for errors
- Verify task-board.js is loaded: Open DevTools → Sources tab
- Try different browser (Safari drag-drop has known issues)

## 📝 Future Enhancements

- [ ] User authentication (proper login/signup)
- [ ] Email notifications for deadlines
- [ ] Calendar integration
- [ ] AI-powered recommendations
- [ ] Team collaboration
- [ ] Mobile app
- [ ] Dark mode
- [ ] Offline support

## 🤝 Contributing

This is a student project MVP. For improvements, create an issue or pull request.

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Agung Pramutama**  
Student Project - Academic Productivity Platform

## 🙏 Acknowledgments

- Express.js for robust web framework
- Prisma for elegant ORM
- PostgreSQL for reliable database
- Google Analytics for usage tracking

---

**Status**: Active Development - MVP Phase  
**Last Updated**: 2025  
**Version**: 0.1.0
