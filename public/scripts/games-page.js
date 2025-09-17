// Attach CSP-safe event handlers for the games page
(function attachGameControls() {
  if (typeof window === 'undefined') return;
  const root = document;

  // Refresh game
  const refreshBtn = root.querySelector('[data-action="refresh-game"]');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }

  // Fullscreen the first iframe inside the main game frame
  const fullscreenBtn = root.querySelector('[data-action="fullscreen-game"]');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const iframe = root.querySelector('.main-game-frame iframe');
      if (iframe && iframe.requestFullscreen) {
        iframe.requestFullscreen().catch(() => {});
      }
    });
  }
})();
