# API Routes Documentation

## Base URL

```
http://localhost:3000
```

## Landing Page Routes

### GET /
Landing page with hero section, features, waitlist signup

**Response**: HTML (landing.ejs)

**Query Parameters**: None

**Example**:
```
GET /
```

---

## Onboarding Routes

### GET /onboarding
Display onboarding form for new users

**Response**: HTML (onboarding.ejs)

**Form Fields**:
- name (string, required)
- email (string, required, unique)
- education_level (enum: 'S1', 'S2', required)
- semester (number, 1-8, required)
- study_program (string, required)
- avg_tasks_per_week (number, required)
- main_pain_point (string, required)

**Example**:
```
GET /onboarding
```

### POST /onboarding
Create new user with onboarding data, redirect to dashboard

**Request Body**:
```json
{
  "name": "Budi Santoso",
  "email": "budi@university.edu",
  "educationLevel": "S1",
  "semester": 5,
  "studyProgram": "Teknik Informatika",
  "avgTasksPerWeek": 8,
  "mainPainPoint": "Sulit menentukan prioritas"
}
```

**Response**: 
- Success: Redirect to `/dashboard?userId={userId}` with 302
- Error: JSON `{ message: "Error description" }` with 400/500

**Triggers**:
- GA4 event: `onboarding_submit` with user demographics

**Example**:
```
POST /onboarding
Content-Type: application/json

{
  "name": "Budi Santoso",
  "email": "budi@university.edu",
  "educationLevel": "S1",
  "semester": 5,
  "studyProgram": "Teknik Informatika",
  "avgTasksPerWeek": 8,
  "mainPainPoint": "Sulit menentukan prioritas"
}
```

---

## Dashboard Routes

### GET /dashboard/:userId
Display user dashboard with statistics and task recommendations

**URL Parameters**:
- userId (string, required) - User ID from database

**Response**: HTML (dashboard.ejs)

**Includes**:
- Total tasks count
- Completed tasks count
- High priority tasks count
- Completion rate percentage
- Focus session statistics
- Upcoming deadlines
- Top recommendations

**Example**:
```
GET /dashboard/cuid_abc123
```

### GET /api/dashboard/:userId
Get dashboard data as JSON (for AJAX updates)

**URL Parameters**:
- userId (string, required)

**Response**:
```json
{
  "totalTasks": 10,
  "completedTasks": 3,
  "inProgressTasks": 2,
  "notStartedTasks": 5,
  "completionRate": 30,
  "highPriorityTasks": 3,
  "upcomingDeadlines": [
    {
      "id": "task_1",
      "title": "Laporan Project",
      "deadline": "2025-03-10T14:00:00Z"
    }
  ],
  "recommendations": [
    {
      "id": "task_2",
      "title": "Membuat Quiz",
      "priorityScore": 95,
      "actionRecommendation": "Mulai hari ini"
    }
  ],
  "totalFocusSessionsStarted": 5,
  "totalFocusSessionsCompleted": 3
}
```

---

## Task Management Routes

### GET /tasks
Display task board with kanban columns

**Query Parameters**:
- userId (string, required) - User ID

**Response**: HTML (task-board.ejs)

**Example**:
```
GET /tasks?userId=cuid_abc123
```

### GET /tasks/:userId
Get all tasks for user as JSON

**URL Parameters**:
- userId (string, required)

**Response**:
```json
{
  "tasks": [
    {
      "id": "task_1",
      "title": "Laporan Project Web",
      "courseName": "Web Development",
      "deadline": "2025-03-10T14:00:00Z",
      "priorityScore": 110,
      "priorityCategory": "Prioritas Tinggi",
      "status": "not_started"
    }
  ]
}
```

### GET /tasks/add
Display add task form

**Response**: HTML (add-task.ejs)

**Example**:
```
GET /tasks/add?userId=cuid_abc123
```

### POST /tasks
Create new task

**Request Body**:
```json
{
  "userId": "cuid_abc123",
  "title": "Membuat Laporan",
  "courseName": "Web Development",
  "deadline": "2025-03-10T14:00:00Z",
  "difficultyLevel": "high",
  "estimatedHours": 6,
  "importanceLevel": "high"
}
```

**Response**:
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "task_123",
    "title": "Membuat Laporan",
    "priorityScore": 110,
    "priorityCategory": "Prioritas Tinggi"
  }
}
```

**Triggers**:
- GA4 event: `task_create` with task details

---

### PATCH /tasks/:taskId/status
Update task status (move between columns)

**URL Parameters**:
- taskId (string, required)

**Request Body**:
```json
{
  "status": "in_progress"
}
```

**Valid Statuses**: `not_started`, `in_progress`, `completed`

**Response**:
```json
{
  "message": "Task status updated",
  "task": {
    "id": "task_123",
    "status": "in_progress"
  }
}
```

**Triggers**:
- GA4 event: `task_status_update`
- GA4 event: `task_completed` (if status = 'completed')

**Example**:
```
PATCH /tasks/task_123/status
Content-Type: application/json

{
  "status": "completed"
}
```

---

### DELETE /tasks/:taskId
Delete task

**URL Parameters**:
- taskId (string, required)

**Response**:
```json
{
  "message": "Task deleted successfully"
}
```

**Example**:
```
DELETE /tasks/task_123
```

---

## Focus Session Routes

### GET /focus/:taskId
Display focus session timer interface

**URL Parameters**:
- taskId (string, required)

**Response**: HTML (focus-session.ejs)

**Includes**:
- Task details
- Recommended duration
- Timer interface
- Tips for focus

**Example**:
```
GET /focus/task_123
```

### POST /focus/start
Record focus session start

**Request Body**:
```json
{
  "userId": "cuid_abc123",
  "taskId": "task_123",
  "recommendedDuration": 50
}
```

**Response**:
```json
{
  "message": "Focus session started",
  "sessionId": "session_456"
}
```

**Triggers**:
- GA4 event: `focus_session_start`

---

### POST /focus/complete
Record focus session completion

**Request Body**:
```json
{
  "sessionId": "session_456",
  "actualDuration": 48
}
```

**Response**:
```json
{
  "message": "Focus session completed",
  "session": {
    "id": "session_456",
    "status": "completed"
  }
}
```

**Triggers**:
- GA4 event: `focus_session_complete`

---

## Waitlist Routes

### GET /waitlist
Display standalone waitlist page

**Response**: HTML (waitlist.ejs)

**Example**:
```
GET /waitlist
```

### POST /waitlist
Submit waitlist form

**Request Body**:
```json
{
  "name": "Siti Nurhaliza",
  "email": "siti@email.com",
  "preferredFeature": "reminder_deadline"
}
```

**Valid Features**: 
- `reminder_deadline`
- `calendar_integration`
- `productivity_dashboard`
- `ai_recommendation`
- `weekly_report`

**Response**:
```json
{
  "message": "Successfully added to waitlist",
  "waitlistEntry": {
    "id": "wl_789",
    "email": "siti@email.com"
  }
}
```

**Triggers**:
- GA4 event: `waitlist_submit`

**Example**:
```
POST /waitlist
Content-Type: application/json

{
  "name": "Siti Nurhaliza",
  "email": "siti@email.com",
  "preferredFeature": "reminder_deadline"
}
```

---

## Feedback Routes

### GET /feedback
Display feedback form

**Query Parameters**:
- userId (string, required)

**Response**: HTML (feedback.ejs)

**Example**:
```
GET /feedback?userId=cuid_abc123
```

### POST /feedback
Submit feedback

**Request Body**:
```json
{
  "userId": "cuid_abc123",
  "relevanceScore": 5,
  "focusHelpfulnessScore": 4,
  "weeklyUsageIntent": "yes",
  "improvementSuggestion": "Add feature X"
}
```

**Valid Scores**: 1-5 (integer)

**Valid Usage Intent**: `yes`, `no`, `maybe`

**Response**:
```json
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": "fb_012",
    "userId": "cuid_abc123"
  }
}
```

**Triggers**:
- GA4 event: `feedback_submit` with scores and intent

**Example**:
```
POST /feedback
Content-Type: application/json

{
  "userId": "cuid_abc123",
  "relevanceScore": 5,
  "focusHelpfulnessScore": 4,
  "weeklyUsageIntent": "yes",
  "improvementSuggestion": "Add feature X"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input",
  "field": "email",
  "error": "Email already exists"
}
```

### 404 Not Found
```html
<!-- Serves 404.ejs -->
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Database connection failed"
}
```

---

## Status Codes

| Code | Meaning | Example |
| --- | --- | --- |
| 200 | Success (JSON response) | Task updated |
| 302 | Redirect | Onboarding → Dashboard |
| 400 | Bad request | Invalid email format |
| 404 | Not found | Task doesn't exist |
| 500 | Server error | Database error |

---

## Authentication

Currently, TaskFocus Student uses URL-based user identification for MVP:

```
GET /dashboard?userId=cuid_abc123
```

**Future Enhancement**: Replace with proper session-based authentication or JWT tokens.

---

## Rate Limiting

Not implemented in MVP. Recommended for production deployment.

---

## CORS

Not enabled. API is same-origin only.

---

**Last Updated**: 2025
**Version**: 1.0
