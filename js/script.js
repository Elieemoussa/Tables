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

const searchInput = document.getElementById('searchInput');
const suggestionList = document.getElementById('suggestionList');

searchInput.addEventListener('input', function () {
  const value = this.value.trim().toLowerCase();
  suggestionList.innerHTML = '';

  // Only show suggestions if side selected and input not empty
  if (!value || !selectedSide) {
    suggestionList.style.display = 'none';
    return;
  }

  // Find up to 6 matches (name starts with input, on selected side)
  const filtered = guests
    .filter(g => g.side === selectedSide && g.name.toLowerCase().startsWith(value))
    .slice(0, 6);

  if (filtered.length === 0) {
    suggestionList.style.display = 'none';
    return;
  }

  filtered.forEach(g => {
    const item = document.createElement('div');
    item.className = 'list-group-item list-group-item-action';
    item.textContent = g.name;
    item.onclick = () => {
      searchInput.value = g.name;
      suggestionList.innerHTML = '';
      suggestionList.style.display = 'none';
      // Optional: Submit immediately
      document.getElementById('searchForm').dispatchEvent(new Event('submit'));
    };
    suggestionList.appendChild(item);
  });

  suggestionList.style.display = 'block';
});

// Hide suggestions on blur
searchInput.addEventListener('blur', () => {
  setTimeout(() => suggestionList.style.display = 'none', 150);
});
searchInput.addEventListener('focus', function() {
  if (this.value.trim() && suggestionList.children.length) {
    suggestionList.style.display = 'block';
  }
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


