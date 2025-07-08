// ui.js
import { setSelectedSide } from './data.js';

export function setupSideSelection() {
  document.querySelectorAll('[data-side]').forEach(btn => {
    btn.addEventListener('click', function() {
      setSelectedSide(this.getAttribute('data-side'));
      document.getElementById('sideStep').classList.add('d-none');
      document.getElementById('searchStep').classList.remove('d-none');
      document.getElementById('searchInput').focus();
      document.getElementById('searchInput').value = '';
    });
  });
}

// Retry button handler
export function setRetryButton() {
  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) {
    retryBtn.onclick = () => {
      // Animate fade out for result step
      const resultStep = document.getElementById('resultStep');
      resultStep.classList.add('fade-out');
      setTimeout(() => {
        resultStep.classList.add('d-none');
        resultStep.classList.remove('fade-out');
        resultStep.innerHTML = '';
        document.getElementById('retryBtnWrapper').classList.add('d-none');
        document.getElementById('searchStep').classList.add('d-none');
        const sideStep = document.getElementById('sideStep');
        sideStep.classList.remove('d-none', 'fade-out');
        sideStep.classList.add('fade-in');
        setSelectedSide(null);
        document.getElementById('searchInput').value = '';
      }, 300);
    };
  }
}
