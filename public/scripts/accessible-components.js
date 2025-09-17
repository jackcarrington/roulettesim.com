// CSP-safe handlers for the Accessible Components demo page
(function initAccessibleComponentsDemo() {
  if (typeof window === 'undefined') return;
  const confirmBtn = document.getElementById('modal2-confirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      // Try to close modal by finding closest dialog dismiss control
      const modal = confirmBtn.closest('[role="dialog"], .aac-modal');
      if (modal) {
        const closeBtn = modal.querySelector('[data-close], [aria-label="Close"], button');
        if (closeBtn && closeBtn !== confirmBtn) {
          closeBtn.click();
        }
      }
    });
  }
})();
