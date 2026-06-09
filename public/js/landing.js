/**
 * TASKFOCUS STUDENT - LANDING PAGE INTERACTIONS
 * Handles CTA clicks, scroll tracking, and waitlist form submission
 */

document.addEventListener('DOMContentLoaded', function () {
  setupCTAButtons();
  setupWaitlistForm();
  setupSmoothScroll();
  setupScrollTracking();
});

/**
 * Setup primary CTA button tracking
 */
function setupCTAButtons() {
  const ctaButtons = document.querySelectorAll('[data-cta="main"]');

  ctaButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      // Track GA4 event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          cta_text: this.textContent,
          cta_location: this.dataset.location || 'unknown',
        });
      }

      // The button href will navigate naturally, or form submission will handle it
    });
  });
}

/**
 * Setup waitlist form submission with AJAX
 */
function setupWaitlistForm() {
  const waitlistForms = document.querySelectorAll('[data-form="waitlist"]');

  waitlistForms.forEach((form) => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const submitBtn = this.querySelector('[type="submit"]');

      // Store original button text
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';

      try {
        const response = await fetch('/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            preferredFeature:
              formData.get('preferred_feature') || 'tidak ada',
          }),
        });

        if (response.ok) {
          const result = await response.json();

          // Track GA4 event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_submit', {
              email: formData.get('email'),
              preferred_feature:
                formData.get('preferred_feature') || 'tidak ada',
            });
          }

          // Reset form
          this.reset();

          // Show success message
          showWaitlistSuccess(submitBtn);
        } else {
          const error = await response.json();
          showWaitlistError(submitBtn, error.message);
        }
      } catch (error) {
        console.error('Error submitting waitlist:', error);
        showWaitlistError(submitBtn, 'Terjadi kesalahan. Silakan coba lagi.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });
}

/**
 * Show success message for waitlist submission
 */
function showWaitlistSuccess(btn) {
  const originalText = btn.textContent;

  btn.textContent = '✓ Terima kasih! Cek email Anda.';
  btn.style.backgroundColor = '#10b981';
  btn.style.color = 'white';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.backgroundColor = '';
    btn.style.color = '';
  }, 3000);
}

/**
 * Show error message for waitlist submission
 */
function showWaitlistError(btn, errorMessage) {
  const originalText = btn.textContent;

  btn.textContent = '✗ ' + errorMessage;
  btn.style.backgroundColor = '#ef4444';
  btn.style.color = 'white';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.backgroundColor = '';
    btn.style.color = '';
  }, 3000);
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if href is just "#"
      if (href === '#') {
        return;
      }

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Track GA4 event for section scroll
        if (typeof gtag !== 'undefined') {
          gtag('event', 'section_scroll', {
            section: href.replace('#', ''),
          });
        }
      }
    });
  });
}

/**
 * Track scroll depth for analytics
 */
function setupScrollTracking() {
  let scrollDepth = 0;
  const scrollThresholds = [25, 50, 75, 100];
  let thresholdsTracked = [];

  window.addEventListener(
    'scroll',
    debounce(function () {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const currentDepth = Math.round(
        ((scrollTop + windowHeight) / docHeight) * 100
      );

      // Track when user reaches certain scroll depths
      scrollThresholds.forEach((threshold) => {
        if (
          currentDepth >= threshold &&
          !thresholdsTracked.includes(threshold)
        ) {
          thresholdsTracked.push(threshold);

          if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {
              depth_percent: threshold,
            });
          }
        }
      });
    }, 500)
  );
}

/**
 * Debounce helper function for scroll tracking
 */
function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Setup "Lihat Cara Kerja" button to scroll to how-it-works section
 */
document.addEventListener('DOMContentLoaded', function () {
  const scrollButtons = document.querySelectorAll('[data-scroll-to]');

  scrollButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const sectionId = this.dataset.scrollTo;
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        if (typeof gtag !== 'undefined') {
          gtag('event', 'learn_more_click', {
            section: sectionId,
          });
        }
      }
    });
  });
});
