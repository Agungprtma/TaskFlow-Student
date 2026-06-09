# Google Analytics 4 Events Documentation

## Overview

TaskFocus Student menggunakan Google Analytics 4 (GA4) untuk melacak user behavior, measuring product engagement, dan understanding user journey. Semua event tracking menggunakan gtag.js library dengan Measurement ID yang dapat dikonfigurasi.

## Setup

### Measurement ID

```html
<!-- Replace with actual GA4 Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Where to configure**:
- All `.ejs` view files in `views/` directory
- Update `G-XXXXXXXXXX` with actual measurement ID from Google Analytics 4 property

## Event Tracking List

### 1. Landing Page Events

#### cta_click
Fired when user clicks main CTA button ("Mulai Atur Prioritas" or "Lihat Cara Kerja")

```javascript
gtag('event', 'cta_click', {
  'cta_text': 'Mulai Atur Prioritas', // or 'Lihat Cara Kerja'
  'cta_location': 'hero',             // 'hero', 'features', 'footer'
});
```

**Use Case**: Measure conversion from landing page awareness to action intent
**Importance**: High - Critical for landing page optimization

#### scroll_depth
Fired when user scrolls past 25%, 50%, 75%, 100% of page

```javascript
gtag('event', 'scroll_depth', {
  'depth_percent': 25,  // 25, 50, 75, or 100
});
```

**Use Case**: Understand which sections of landing page capture user interest
**Importance**: Medium - Content relevance tracking

#### section_scroll
Fired when user clicks internal links to scroll to sections

```javascript
gtag('event', 'section_scroll', {
  'section': 'how_it_works',  // 'problem', 'solution', 'features', 'waitlist'
});
```

**Use Case**: Track which sections users are most interested in
**Importance**: Medium - Feature interest tracking

### 2. Onboarding Events

#### onboarding_submit
Fired when user completes onboarding form and creates their profile

```javascript
gtag('event', 'onboarding_submit', {
  'education_level': 'S1',                    // 'S1' or 'S2'
  'semester': 5,                              // 1-8 for S1, 1-4 for S2
  'main_pain_point': 'Sulit menentukan prioritas',
  'avg_tasks_per_week': 8,
});
```

**Use Case**: Track onboarding completion and gather demographic insights
**Importance**: High - Key conversion metric

**Funnel Position**: Landing Page → Onboarding Submit

### 3. Task Management Events

#### task_create
Fired when user creates a new task

```javascript
gtag('event', 'task_create', {
  'task_id': 'cuid-123456',                 // Task ID from database
  'difficulty_level': 'high',               // 'high', 'medium', 'low'
  'importance_level': 'high',               // 'high', 'medium', 'low'
  'estimated_hours': 6,                     // Numeric value
  'priority_score': 110,                    // Calculated score 0-140
});
```

**Use Case**: Measure task creation frequency and task characteristics
**Importance**: High - Core engagement metric

**Funnel Position**: Onboarding → Task Create

#### task_priority_view
Fired when user views task list with priority information

```javascript
gtag('event', 'task_priority_view', {
  'total_tasks': 10,                        // Total tasks shown
  'high_priority_count': 3,                 // Tasks with high priority
  'medium_priority_count': 4,               // Tasks with medium priority
  'low_priority_count': 3,                  // Tasks with low priority
});
```

**Use Case**: Understand how many tasks fall into each priority category
**Importance**: Medium - Feature adoption tracking

#### task_drag_start
Fired when user starts dragging a task card

```javascript
gtag('event', 'task_drag_start', {
  'task_id': 'cuid-123456',
  'current_status': 'not_started',          // 'not_started', 'in_progress', 'completed'
  'priority_category': 'Prioritas Tinggi',
});
```

**Use Case**: Understand drag-and-drop feature adoption
**Importance**: Low - Feature usage detail

#### task_status_update
Fired when user successfully moves task to different status column

```javascript
gtag('event', 'task_status_update', {
  'task_id': 'cuid-123456',
  'old_status': 'not_started',              // Original status
  'new_status': 'in_progress',              // New status
  'priority_category': 'Prioritas Tinggi',  // Priority level
  'priority_score': 110,                    // Score 0-140
  'estimated_hours': 6,                     // Task duration estimate
});
```

**Use Case**: Track task workflow progression
**Importance**: High - User engagement metric

**Funnel Position**: Task Create → Task Status Update

#### task_completed
Fired when task is moved to "Selesai" (Completed) column

```javascript
gtag('event', 'task_completed', {
  'task_id': 'cuid-123456',
  'priority_category': 'Prioritas Tinggi',  // 'Prioritas Tinggi', 'Prioritas Sedang', 'Prioritas Rendah'
  'completion_time_hours': 3.5,             // Actual time spent (optional)
});
```

**Use Case**: Track task completion rate and priority success
**Importance**: High - Key success metric

**Funnel Position**: Task Status Update → Task Completed

### 4. Focus Session Events

#### focus_session_start
Fired when user clicks "Mulai Sesi Fokus" and starts timer

```javascript
gtag('event', 'focus_session_start', {
  'task_id': 'cuid-123456',
  'recommended_duration': 50,               // Minutes (25, 50, or 90)
  'estimated_task_hours': 6,                // Estimated hours for task
});
```

**Use Case**: Measure focus session initiation
**Importance**: High - Feature adoption metric

**Funnel Position**: Task Status Update → Focus Session Start

#### focus_session_complete
Fired when user successfully completes focus session

```javascript
gtag('event', 'focus_session_complete', {
  'task_id': 'cuid-123456',
  'recommended_duration': 50,               // Planned duration in minutes
  'actual_duration': 48,                    // Actual duration in minutes
  'session_status': 'completed',            // 'completed' or 'abandoned'
});
```

**Use Case**: Track focus session completion and effectiveness
**Importance**: High - Feature engagement metric

**Funnel Position**: Focus Session Start → Focus Session Complete

### 5. Waitlist Events

#### waitlist_submit
Fired when user submits their email to waitlist

```javascript
gtag('event', 'waitlist_submit', {
  'email': 'user@email.com',
  'preferred_feature': 'reminder_deadline', // Feature preference
  'source': 'landing_page',                 // Where form was filled
});
```

**Use Case**: Track interest and feature preferences from non-converted users
**Importance**: High - Lead generation metric

**Funnel Position**: CTA Click → Waitlist Submit

### 6. Feedback Events

#### feedback_submit
Fired when user submits feedback form

```javascript
gtag('event', 'feedback_submit', {
  'relevance_score': 5,                     // 1-5 scale for priority relevance
  'focus_helpfulness_score': 4,             // 1-5 scale for focus session help
  'weekly_usage_intent': 'yes',             // 'yes', 'no', 'maybe'
  'improvement_suggestion_length': 150,     // Character count
});
```

**Use Case**: Measure product satisfaction and intention to use
**Importance**: High - Feedback collection metric

**Funnel Position**: Focus Session Complete → Feedback Submit

## Analytics Funnels

### Primary Conversion Funnel

```
Landing Page View (entry point)
    ↓
CTA Click (cta_click)
    ↓
Onboarding Submit (onboarding_submit)
    ↓
Task Create (task_create)
    ↓
Task Priority View (task_priority_view)
    ↓
Task Status Update (task_status_update)
    ↓
Focus Session Start (focus_session_start)
    ↓
Focus Session Complete (focus_session_complete)
    ↓
Feedback Submit (feedback_submit)
```

### Key Conversion Points

1. **Awareness → Interest**: Landing page → CTA Click
2. **Interest → Signup**: CTA Click → Onboarding Submit
3. **Signup → First Action**: Onboarding → Task Create
4. **Engagement → Feature Use**: Task Create → Focus Session
5. **Feature Use → Satisfaction**: Focus Session → Feedback

## Key Metrics

### Calculated from Events

1. **Onboarding Conversion Rate**
   - Formula: `onboarding_submit / cta_click * 100`
   - Target: >30% (Convert 30% of clickers to signups)

2. **Task Creation Rate**
   - Formula: `task_create / onboarding_submit * 100`
   - Target: >80% (Most users should create at least one task)

3. **Focus Session Adoption**
   - Formula: `focus_session_start / task_create * 100`
   - Target: >40% (Over 40% of tasks should trigger focus sessions)

4. **Focus Session Completion**
   - Formula: `focus_session_complete / focus_session_start * 100`
   - Target: >70% (70% of started sessions should complete)

5. **Task Completion Rate**
   - Formula: `task_completed / task_create * 100`
   - Target: >60% (Users should complete majority of created tasks)

6. **Weekly Usage Intent**
   - Formula: `Count of 'yes' in weekly_usage_intent / total_feedback * 100`
   - Target: >50% (Over 50% indicate willingness to use weekly)

## Data Points to Track

### User Properties (Custom Dimensions)

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'user_id': 'user-uuid',
  'education_level': 'S1',
  'semester': 5,
  'main_pain_point': 'Sulit menentukan prioritas',
});
```

### Session Properties

```javascript
gtag('set', {
  'session_source': 'organic',        // Referring source
  'session_medium': 'social',         // Medium (direct, organic, paid, social)
  'session_campaign': 'launch',       // Campaign name
});
```

## Implementation Notes

### Event Naming Convention

- Event names use snake_case (e.g., `task_status_update`)
- Parameter names use snake_case (e.g., `task_id`, `priority_score`)
- Values should be strings or numbers (no objects)

### Best Practices

1. **Fire events at the right time**:
   - Fire after user action is confirmed, not on prediction
   - For async operations, fire after successful response

2. **Include contextual parameters**:
   - Always include `task_id` when relevant
   - Include calculated metrics like `priority_score`
   - Include user selections like `priority_category`

3. **Sensitive data**:
   - Never send personally identifiable information (PII)
   - Never send task names or detailed descriptions
   - Only send aggregated or non-sensitive metrics

4. **Testing**:
   - Use Google Analytics DebugView during development
   - Verify events in browser console: `console.log(dataLayer)`
   - Test in staging before deploying to production

## Viewing Reports

### Google Analytics 4 Dashboard

1. **Real-time Events**: Reports → Real-time → Events
2. **Conversion Funnel**: Reports → Funnel Analysis
3. **User Journeys**: Exploration → Funnel Exploration
4. **Custom Events**: Events → All Events

### Recommended Custom Reports

1. **Funnel: CTA to Feedback**
   - Shows full user journey from initial click to product validation

2. **Priority Distribution**
   - Shows breakdown of tasks created by priority category

3. **Focus Session Effectiveness**
   - Correlates session completion with task completion

4. **Feature Adoption Timeline**
   - Shows adoption curve for focus sessions and task board

## Configuration for Production

Before deploying to production:

1. Replace `G-XXXXXXXXXX` with actual GA4 Measurement ID
2. Verify all events are firing in GA4 interface
3. Set up conversion events in GA4 admin panel
4. Create custom reports for key metrics
5. Set up alerts for funnel drop-offs

## Troubleshooting

### Event not showing up?

1. Check browser console for JavaScript errors
2. Verify gtag is loaded: `console.log(typeof gtag)`
3. Check GA4 DebugView: Analytics → Configure → DebugView
4. Verify event names match exactly (case-sensitive)
5. Allow up to 24 hours for data to appear in reports

### Incorrect parameter values?

1. Check data types match GA4 expectations (string, number, bool)
2. Verify parameter names use snake_case
3. Check for encoding issues in special characters
4. Test in browser console before production deployment

---

**Last Updated**: 2025
**Version**: 1.0
**GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
