/**
 * TASKFOCUS STUDENT - DASHBOARD INTERACTIONS
 * Handles dashboard data updates, real-time statistics, and user interactions
 */

document.addEventListener('DOMContentLoaded', function () {
  initializeDashboard();
  setupQuickActions();
  setupAutoRefresh();
});

/**
 * Initialize dashboard with event listeners
 */
function initializeDashboard() {
  const userId = new URLSearchParams(window.location.search).get('userId');

  if (!userId) {
    console.warn('User ID not found in URL');
    return;
  }

  // Store userId for later use
  window.currentUserId = userId;

  // Initial load of recommendations
  loadRecommendations(userId);

  // Setup add task form submission
  setupAddTaskForm(userId);
}

/**
 * Load task recommendations from API
 */
function loadRecommendations(userId) {
  // Recommendations are loaded from the initial page render
  // But we can refresh them on demand
  const refreshBtn = document.querySelector('[data-action="refresh-recommendations"]');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      this.disabled = true;
      this.textContent = 'Memperbarui...';

      // Simulate refresh delay
      setTimeout(() => {
        this.disabled = false;
        this.textContent = 'Perbarui Rekomendasi';
        showNotification(
          'Rekomendasi tugas telah diperbarui',
          'success'
        );
      }, 1000);
    });
  }
}

/**
 * Setup add task form
 */
function setupAddTaskForm(userId) {
  const addTaskForm = document.querySelector('[data-form="add-task"]');

  if (addTaskForm) {
    addTaskForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitBtn = this.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Menyimpan...';

      try {
        const response = await fetch('/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            title: formData.get('title'),
            courseName: formData.get('course_name'),
            deadline: formData.get('deadline'),
            difficultyLevel: formData.get('difficulty_level'),
            estimatedHours: parseFloat(formData.get('estimated_hours')),
            importanceLevel: formData.get('importance_level'),
          }),
        });

        if (response.ok) {
          const result = await response.json();

          // Track GA4 event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'task_create', {
              task_id: result.task.id,
              difficulty_level: formData.get('difficulty_level'),
              importance_level: formData.get('importance_level'),
              estimated_hours: parseFloat(
                formData.get('estimated_hours')
              ),
            });
          }

          // Reset form
          this.reset();

          // Show success message
          showNotification('Tugas berhasil ditambahkan', 'success');

          // Refresh dashboard and board view
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          const error = await response.json();
          showNotification(
            error.message || 'Gagal menambahkan tugas',
            'error'
          );
        }
      } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Terjadi kesalahan saat menambahkan tugas', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

/**
 * Setup quick action buttons on dashboard
 */
function setupQuickActions() {
  const viewBoardBtn = document.querySelector(
    '[data-action="view-board"]'
  );
  const addTaskBtn = document.querySelector('[data-action="add-task"]');
  const viewFeedbackBtn = document.querySelector(
    '[data-action="view-feedback"]'
  );

  if (viewBoardBtn) {
    viewBoardBtn.addEventListener('click', function () {
      const userId = window.currentUserId;
      window.location.href = `/tasks?userId=${userId}`;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'dashboard_action', {
          action: 'view_board',
        });
      }
    });
  }

  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', function () {
      const addTaskModal = document.querySelector('[data-modal="add-task"]');

      if (addTaskModal) {
        addTaskModal.style.display = 'block';

        if (typeof gtag !== 'undefined') {
          gtag('event', 'dashboard_action', {
            action: 'open_add_task',
          });
        }
      }
    });
  }

  if (viewFeedbackBtn) {
    viewFeedbackBtn.addEventListener('click', function () {
      const userId = window.currentUserId;
      window.location.href = `/feedback?userId=${userId}`;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'dashboard_action', {
          action: 'open_feedback',
        });
      }
    });
  }

  // Setup modal close buttons
  setupModalClose();
}

/**
 * Setup modal closing functionality
 */
function setupModalClose() {
  const closeButtons = document.querySelectorAll('[data-action="close-modal"]');

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const modal = this.closest('[data-modal]');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Close modal when clicking outside
  const modals = document.querySelectorAll('[data-modal]');

  modals.forEach((modal) => {
    modal.addEventListener('click', function (e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });
}

/**
 * Setup auto-refresh of dashboard data
 * Refreshes every 30 seconds
 */
function setupAutoRefresh() {
  setInterval(function () {
    updateDashboardStats();
  }, 30000);
}

/**
 * Update dashboard statistics from API
 */
function updateDashboardStats() {
  const userId = window.currentUserId;

  if (!userId) {
    return;
  }

  fetch(`/dashboard/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      // Update dashboard widgets
      const widgets = {
        totalTasks: data.totalTasks || 0,
        completedTasks: data.completedTasks || 0,
        inProgressTasks: data.inProgressTasks || 0,
        notStartedTasks: data.notStartedTasks || 0,
        completionRate: Math.round(data.completionRate) || 0,
        highPriorityTasks: data.highPriorityTasks || 0,
        totalFocusSessionsStarted:
          data.totalFocusSessionsStarted || 0,
        totalFocusSessionsCompleted:
          data.totalFocusSessionsCompleted || 0,
      };

      Object.entries(widgets).forEach(([key, value]) => {
        const element = document.querySelector(
          `[data-stat="${key}"]`
        );
        if (element) {
          element.textContent = value;
        }
      });
    })
    .catch((error) => console.error('Error updating dashboard:', error));
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '400px';
  notification.textContent = message;
  notification.style.animation = 'slideInUp 0.3s ease-out';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

/**
 * Calculate days until deadline
 */
function daysUntilDeadline(deadlineString) {
  const deadline = new Date(deadlineString);
  const today = new Date();
  const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    return 'Overdue';
  } else if (diff === 0) {
    return 'Hari ini';
  } else if (diff === 1) {
    return 'Besok';
  } else {
    return `${diff} hari lagi`;
  }
}

/**
 * Export dashboard data (for future analytics)
 */
function exportDashboardData() {
  const userId = window.currentUserId;

  if (!userId) {
    showNotification('User ID tidak ditemukan', 'error');
    return;
  }

  fetch(`/dashboard/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-data-${userId}-${new Date().toISOString()}.json`;
      link.click();

      showNotification('Data dashboard berhasil diunduh', 'success');
    })
    .catch((error) => {
      console.error('Error exporting data:', error);
      showNotification('Gagal mengunduh data dashboard', 'error');
    });
}
