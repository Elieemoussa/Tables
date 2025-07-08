let guests = [];
let selectedSide = null;

// Fetch guests from JSON
fetch('/cleint/1.json')
  .then(response => response.json())
  .then(data => { guests = data; });

// Step 1: Choose Side
document.querySelectorAll('[data-side]').forEach(btn => {
  btn.addEventListener('click', function() {
    selectedSide = this.getAttribute('data-side');
    document.getElementById('sideStep').classList.add('d-none');
    document.getElementById('searchStep').classList.remove('d-none');
    document.getElementById('searchInput').focus();
    document.getElementById('searchInput').value = '';
  });
});

// Step 2: Search Bar Enter
document.getElementById('searchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!input) return;

  // Search guests: same side & (name startsWith OR number match)
  let matchedGuests = [];
  if (!isNaN(input)) {
    matchedGuests = guests.filter(g => g.side === selectedSide && g.number.toString() === input);
  } else {
    matchedGuests = guests.filter(g => g.side === selectedSide && g.name.toLowerCase().startsWith(input));
  }

  document.getElementById('searchStep').classList.add('d-none');
  showResult(matchedGuests, input);
});

// Step 3: Show Result Only
function showResult(matches, searchVal) {
  const resultStep = document.getElementById('resultStep');
  resultStep.classList.remove('d-none');
  resultStep.innerHTML = '';

  if (matches.length === 0) {
    resultStep.innerHTML = `
      <div class="alert alert-warning text-center" role="alert" style="font-size:1.13rem;">
        Sorry, no match found on the ${selectedSide === 'bride' ? "Bride" : "Groom"}'s side.<br>
        Please check your entry.
      </div>
      <div class="text-center mt-4">
        <button class="btn btn-outline-secondary" id="retryBtn">
          <i class="bi bi-arrow-clockwise me-1"></i>Not you? Search again
        </button>
      </div>
    `;
    setRetryButton();
    return;
  }

  matches.forEach(guest => {
    resultStep.innerHTML += `
      <div class="card shadow ${guest.side}">
        <h3 class="mb-3">${guest.name}</h3>
        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item"><strong>Table:</strong> ${guest.table}</li>
          <li class="list-group-item"><strong>Guest Count:</strong> ${guest.familyCount}</li>
        </ul>
        <div class="text-center">
          <span class="badge bg-${guest.side === 'bride' ? 'danger' : 'primary'}">
            ${guest.side.charAt(0).toUpperCase() + guest.side.slice(1)}'s Side
          </span>
        </div>
      </div>
    `;
  });

document.getElementById('retryBtnWrapper').classList.remove('d-none');
setRetryButton();
}

// Add this helper function to handle the retry button
function setRetryButton() {
  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) {
    retryBtn.onclick = () => {
      // Animate fade out for result step
      const resultStep = document.getElementById('resultStep');
      resultStep.classList.add('fade-out');

      setTimeout(() => {
        // Hide result and reset content
        resultStep.classList.add('d-none');
        resultStep.classList.remove('fade-out');
        resultStep.innerHTML = '';

        // Hide retry button itself
        document.getElementById('retryBtnWrapper').classList.add('d-none');

        // Hide search step (in case)
        document.getElementById('searchStep').classList.add('d-none');

        // Show side selection with fade-in
        const sideStep = document.getElementById('sideStep');
        sideStep.classList.remove('d-none', 'fade-out');
        sideStep.classList.add('fade-in');

        // Reset JS variables and clear input field
        selectedSide = null;
        document.getElementById('searchInput').value = '';
      }, 300); // Matches fade animation
    };
  }
}


