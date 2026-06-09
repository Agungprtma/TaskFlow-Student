# TaskFocus Student - Setup & Installation Guide

## Prerequisites

Before setting up TaskFocus Student, ensure you have the following installed on your system:

- **Node.js**: v14.0.0 or higher (LTS recommended)
- **npm**: v6.0.0 or higher (comes with Node.js)
- **PostgreSQL**: v12.0 or higher
- **Git**: For version control

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL version
psql --version
```

## Quick Start (5 minutes)

### 1. Clone Repository

```bash
cd /path/to/your/workspace
git clone https://github.com/Agungprtma/TaskFlow-Student.git
cd TaskFlow-Student
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Configure Database

```bash
# Create PostgreSQL database
createdb taskfocus_student

# Update DATABASE_URL in .env
# Default: ******localhost:5432/taskfocus_student
```

### 5. Setup Database Schema

```bash
# Run Prisma migrations
npm run db:migrate

# (Optional) Seed dummy data
npm run db:seed
```

### 6. Start Development Server

```bash
# Start the application
npm run dev

# Application will be available at: http://localhost:3000
```

## Detailed Setup Guide

### Database Configuration

#### Option A: PostgreSQL on Same Machine (Recommended for Development)

```bash
# 1. Open PostgreSQL command line
psql -U postgres

# 2. Create database and user
CREATE DATABASE taskfocus_student;
CREATE USER taskfocus_user WITH PASSWORD 'your_secure_password';
ALTER ROLE taskfocus_user SET client_encoding TO 'utf8';
ALTER ROLE taskfocus_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE taskfocus_user SET default_transaction_deferrable TO on;
ALTER ROLE taskfocus_user SET default_transaction_read_only TO off;
ALTER ROLE taskfocus_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE taskfocus_student TO taskfocus_user;
\q

# 3. Update .env file
DATABASE_URL="******localhost:5432/taskfocus_student"
```

#### Option B: Docker PostgreSQL

```bash
# Start PostgreSQL container
docker run --name taskfocus-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Create database
docker exec taskfocus-db createdb -U postgres taskfocus_student

# Update .env
DATABASE_URL="******localhost:5432/taskfocus_student"
```

### Environment Variables (.env)

Create `.env` file in project root with:

```bash
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DATABASE_URL="******localhost:5432/taskfocus_student"

# Google Analytics 4
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Session
SESSION_SECRET=your_random_session_secret_here_min_32_chars

# Email (Optional - for future transactional emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Application URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### Prisma Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Create database schema from schema.prisma
npm run db:migrate

# View database
npm run db:studio

# Seed sample data
npm run db:seed
```

## Project Structure

```
TaskFlow-Student/
├── src/
│   ├── server.js              # Express server setup
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── routes/
│   │   ├── index.js           # Landing & waitlist
│   │   ├── onboarding.js      # User registration
│   │   ├── dashboard.js       # Dashboard & stats
│   │   ├── tasks.js           # Task CRUD & board
│   │   ├── focus.js           # Focus session timer
│   │   ├── waitlist.js        # Waitlist form
│   │   └── feedback.js        # Feedback collection
│   ├── services/
│   │   ├── database.js        # Database operations
│   │   └── priorityScoring.js # Priority algorithm
│   └── middleware/
│       └── errorHandler.js    # Error handling
├── views/                     # EJS templates
│   ├── landing.ejs
│   ├── onboarding.ejs
│   ├── dashboard.ejs
│   ├── task-board.ejs
│   ├── add-task.ejs
│   ├── focus-session.ejs
│   ├── feedback.ejs
│   ├── waitlist.ejs
│   ├── 404.ejs
│   └── error.ejs
├── public/
│   ├── css/
│   │   └── styles.css         # Main stylesheet
│   └── js/
│       ├── landing.js         # Landing page interactivity
│       ├── dashboard.js       # Dashboard updates
│       └── task-board.js      # Drag-and-drop logic
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Dummy data
├── docs/
│   ├── PRIORITY_SCORING.md    # Priority algorithm docs
│   ├── GA4_EVENTS.md          # Analytics events docs
│   └── API_ROUTES.md          # API endpoint docs
├── .env.example               # Environment template
├── package.json               # Dependencies
└── README.md                  # Project documentation
```

## Available npm Scripts

```bash
# Development
npm run dev              # Start development server with nodemon

# Database
npm run prisma:generate # Generate Prisma client
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed sample data
npm run db:studio       # Open Prisma Studio (GUI)
npm run db:reset        # Reset database (development only)

# Production
npm start               # Start production server
npm run build          # Build project (if applicable)

# Linting & Format
npm run lint           # Lint JavaScript files
npm run format         # Format code with Prettier
```

## Database Migrations

### Create New Migration

```bash
# After modifying schema.prisma
npx prisma migrate dev --name add_new_field

# This will:
# 1. Create migration file
# 2. Apply migration to database
# 3. Regenerate Prisma client
```

### Apply Migrations in Production

```bash
# Run pending migrations
npx prisma migrate deploy

# No generated Prisma Client needed in production
npx generate
```

### Reset Database (Development Only)

```bash
# WARNING: This will delete all data!
npx prisma migrate reset

# You'll be prompted to confirm, then:
# 1. Drop database
# 2. Recreate database
# 3. Apply all migrations
# 4. Run seed script
```

## First Steps After Setup

### 1. Verify Application is Running

```bash
# Open browser and navigate to:
http://localhost:3000

# You should see the landing page
```

### 2. Test Onboarding Flow

1. Click "Mulai Atur Prioritas" button
2. Fill in the onboarding form
3. Submit - you should be redirected to dashboard

### 3. Test Task Creation

1. On dashboard, click "Tambah Tugas"
2. Fill in task details
3. Submit - task should appear on task board

### 4. Test Drag-and-Drop

1. On task board, try dragging a task card
2. Drop it on different status columns
3. Task status should update in database

### 5. Test Focus Session

1. Click "Mulai Sesi Fokus" on any task
2. Start timer - it should count down
3. Mark as completed

### 6. View Database

```bash
# Open Prisma Studio GUI
npm run db:studio

# This opens http://localhost:5555
# Allows viewing and editing data directly
```

## Testing

### Manual Testing

1. **Test all routes**: Visit each page and verify content loads
2. **Test forms**: Submit forms and verify data saves to database
3. **Test drag-and-drop**: Verify tasks move between columns and DB updates
4. **Test analytics**: Open browser console and verify GA4 events fire

### Browser Console

```javascript
// Check if gtag is loaded
console.log(typeof gtag)

// View dataLayer (GA4 events)
console.log(window.dataLayer)

// Manually fire test event
gtag('event', 'test_event', { test: true })
```

### Database Verification

```bash
# Connect to PostgreSQL
psql -U taskfocus_user -d taskfocus_student

# Check users
SELECT * FROM "User";

# Check tasks
SELECT * FROM "Task" WHERE status != 'completed';

# Check focus sessions
SELECT * FROM "FocusSession" ORDER BY "createdAt" DESC;

# Exit
\q
```

## Troubleshooting

### Issue: "Cannot connect to database"

```bash
# 1. Check PostgreSQL is running
psql -U postgres

# 2. Verify DATABASE_URL in .env
# 3. Check database exists
createdb -l | grep taskfocus_student

# 4. Recreate database if needed
npm run db:reset
```

### Issue: "Port 3000 already in use"

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Issue: "Prisma Client not generated"

```bash
# Regenerate Prisma client
npm run prisma:generate

# Or manually
npx prisma generate
```

### Issue: "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Tips

### Hot Reload

Development server uses nodemon for automatic restart on file changes:

```bash
npm run dev
```

Changes to `.ejs` files and `.js` routes reload automatically. For CSS/JS asset changes, refresh browser.

### Debug Mode

```bash
# Run with verbose logging
DEBUG=* npm run dev

# Or specific module
DEBUG=app:* npm run dev
```

### Environment-Specific Behavior

```javascript
// In code
if (process.env.NODE_ENV === 'development') {
  // Development-only code
}
```

## Deployment Preparation

### Pre-Deployment Checklist

- [ ] Update GA measurement ID in all `.ejs` files
- [ ] Configure production database URL
- [ ] Generate Prisma client for production
- [ ] Test all routes in production mode
- [ ] Verify no console errors
- [ ] Check analytics events fire correctly
- [ ] Review error handling and logging
- [ ] Update API endpoint URLs if needed

### Production Setup

```bash
# Set environment
export NODE_ENV=production

# Install dependencies (no dev dependencies)
npm install --production

# Run migrations
npm run db:migrate

# Start server
npm start
```

## Support & Documentation

- **Prisma Docs**: https://www.prisma.io/docs/
- **Express.js Docs**: https://expressjs.com/
- **Google Analytics 4**: https://support.google.com/analytics
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

## Next Steps

1. Read `docs/PRIORITY_SCORING.md` to understand task prioritization algorithm
2. Read `docs/GA4_EVENTS.md` to understand analytics tracking
3. Read `docs/API_ROUTES.md` for API endpoint documentation
4. Explore database schema in `prisma/schema.prisma`
5. Review route implementations in `src/routes/`

---

**Last Updated**: 2025
**Version**: 1.0
