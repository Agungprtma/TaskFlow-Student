/**
 * TASKFOCUS STUDENT - TASK BOARD DRAG & DROP
 * Handles drag-and-drop functionality for task cards on the Kanban board
 * Supports three columns: Belum Mulai, Sedang Dikerjakan, Selesai
 */

document.addEventListener('DOMContentLoaded', function () {
  initializeDragAndDrop();
  setupDeleteButtons();
  setupDetailButtons();
  setupFocusButtons();
});

/**
 * Initialize drag and drop event listeners for all task cards
 */
function initializeDragAndDrop() {
  const taskCards = document.querySelectorAll('.task-card');

  taskCards.forEach((card) => {
    // Drag start
    card.addEventListener('dragstart', function (e) {
      const taskId = this.dataset.taskId;
      const oldStatus = this.dataset.status;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
      e.dataTransfer.setData('taskId', taskId);
      e.dataTransfer.setData('oldStatus', oldStatus);

      this.classList.add('dragging');
      this.style.opacity = '0.5';

      // Track GA4 event for drag start
      if (typeof gtag !== 'undefined') {
        gtag('event', 'task_drag_start', {
          task_id: taskId,
          current_status: oldStatus,
        });
      }
    });

    // Drag end
    card.addEventListener('dragend', function (e) {
      this.classList.remove('dragging');
      this.style.opacity = '1';
    });
  });

  // Setup drop zones (task-cards containers)
  const dropZones = document.querySelectorAll('.task-cards');

  dropZones.forEach((zone) => {
    // Drag over
    zone.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      this.style.backgroundColor = '#e0e7ff';
      this.style.borderRadius = 'var(--radius-lg)';
    });

    // Drag leave
    zone.addEventListener('dragleave', function (e) {
      this.style.backgroundColor = '';
    });

    // Drop
    zone.addEventListener('drop', async function (e) {
      e.preventDefault();
      this.style.backgroundColor = '';

      const taskId = e.dataTransfer.getData('taskId');
      const oldStatus = e.dataTransfer.getData('oldStatus');
      const newStatus = this.dataset.status;

      // Check if task was actually moved to a different status
      if (oldStatus === newStatus) {
        return;
      }

      const draggedCard = document.querySelector(
        `.task-card[data-task-id="${taskId}"]`
      );

      if (draggedCard) {
        try {
          // Call backend API to update task status
          const response = await fetch(`/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          });

          if (response.ok) {
            const result = await response.json();

            // Update card data attributes
            draggedCard.dataset.status = newStatus;

            // Move card to new column
            this.appendChild(draggedCard);

            // Track GA4 events
            if (typeof gtag !== 'undefined') {
              gtag('event', 'task_status_update', {
                task_id: taskId,
                old_status: oldStatus,
                new_status: newStatus,
                priority_category:
                  draggedCard.dataset.priorityCategory ||
                  'unknown',
                priority_score: draggedCard.dataset.priorityScore || 0,
              });

              // Special event for task completion
              if (newStatus === 'completed') {
                gtag('event', 'task_completed', {
                  task_id: taskId,
                  priority_category:
                    draggedCard.dataset.priorityCategory ||
                    'unknown',
                });
              }
            }

            // Update dashboard if it exists
            updateDashboard();

            // Show success message
            showNotification('Tugas berhasil dipindahkan', 'success');
          } else {
            const error = await response.json();
            showNotification(error.message || 'Gagal memindahkan tugas', 'error');
            // Don't move card if API call failed
          }
        } catch (error) {
          console.error('Error updating task status:', error);
          showNotification('Terjadi kesalahan saat memindahkan tugas', 'error');
        }
      }
    });
  });
}

/**
 * Setup delete button functionality for each task card
 */
function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.btn-delete-task');

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();

      const taskCard = this.closest('.task-card');
      const taskId = taskCard.dataset.taskId;

      if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
        return;
      }

      try {
        const response = await fetch(`/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          taskCard.style.opacity = '0';
          setTimeout(() => {
            taskCard.remove();
            updateDashboard();
            showNotification('Tugas berhasil dihapus', 'success');
          }, 300);

          // Track GA4 event (optional)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'task_deleted', {
              task_id: taskId,
            });
          }
        } else {
          showNotification('Gagal menghapus tugas', 'error');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Terjadi kesalahan', 'error');
      }
    });
  });
}

/**
 * Setup detail button functionality to show priority reasoning
 */
function setupDetailButtons() {
  const detailButtons = document.querySelectorAll('.btn-task-detail');

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const taskCard = this.closest('.task-card');
      const taskId = taskCard.dataset.taskId;
      const priorityReason = taskCard.dataset.priorityReason || 'N/A';
      const actionRecommendation =
        taskCard.dataset.actionRecommendation || 'N/A';

      const detailsHTML = `
        <div class="modal-detail">
          <div class="modal-detail-content">
            <h3>Detail Prioritas Tugas</h3>
            <div class="detail-section">
              <h4>Alasan Prioritas</h4>
              <p>${priorityReason}</p>
            </div>
            <div class="detail-section">
              <h4>Rekomendasi Aksi</h4>
              <p>${actionRecommendation}</p>
            </div>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">Tutup</button>
          </div>
        </div>
      `;

      // Remove existing modal if any
      const existingModal = document.querySelector('.modal-detail-overlay');
      if (existingModal) {
        existingModal.remove();
      }

      const overlay = document.createElement('div');
      overlay.className = 'modal-detail-overlay';
      overlay.innerHTML = detailsHTML;
      overlay.addEventListener('click', function (e) {
        if (e.target === this) {
          this.remove();
        }
      });

      document.body.appendChild(overlay);
    });
  });
}

/**
 * Setup focus session start button
 */
function setupFocusButtons() {
  const focusButtons = document.querySelectorAll('.btn-start-focus');

  focusButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const taskCard = this.closest('.task-card');
      const taskId = taskCard.dataset.taskId;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'focus_session_initiated', {
          task_id: taskId,
        });
      }

      // Redirect to focus session page
      window.location.href = `/focus/${taskId}`;
    });
  });
}

/**
 * Update dashboard statistics dynamically
 */
function updateDashboard() {
  // Fetch updated dashboard data
  const userId = getCurrentUserId();

  if (!userId) {
    return;
  }

  fetch(`/api/dashboard/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      // Update dashboard widgets if they exist
      const totalTasksEl = document.querySelector('[data-widget="totalTasks"]');
      const completedTasksEl = document.querySelector(
        '[data-widget="completedTasks"]'
      );
      const completionRateEl = document.querySelector(
        '[data-widget="completionRate"]'
      );
      const highPriorityEl = document.querySelector(
        '[data-widget="highPriority"]'
      );

      if (totalTasksEl)
        totalTasksEl.textContent = data.totalTasks || 0;
      if (completedTasksEl)
        completedTasksEl.textContent = data.completedTasks || 0;
      if (completionRateEl)
        completionRateEl.textContent = data.completionRate + '%';
      if (highPriorityEl)
        highPriorityEl.textContent = data.highPriorityTasks || 0;
    })
    .catch((error) => console.error('Error updating dashboard:', error));
}

/**
 * Get current user ID from URL or session
 */
function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userId') || localStorage.getItem('userId');
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

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/* CSS for modal detail overlay */
const modalStyles = document.createElement('style');
modalStyles.textContent = `
  .modal-detail-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .modal-detail-content {
    background-color: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 500px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    animation: slideInUp 0.3s ease-out;
  }

  .modal-detail-content h3 {
    margin-bottom: 20px;
  }

  .detail-section {
    margin-bottom: 20px;
  }

  .detail-section h4 {
    font-weight: 600;
    margin-bottom: 10px;
    color: #1f2937;
  }

  .detail-section p {
    color: #4b5563;
    line-height: 1.8;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(modalStyles);
