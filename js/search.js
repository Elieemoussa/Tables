// search.js
import { guests, selectedSide } from './data.js';
import { setRetryButton } from './ui.js';

export function setupSearchAndSuggestions() {
  const searchInput = document.getElementById('searchInput');
  const suggestionList = document.getElementById('suggestionList');

  searchInput.addEventListener('input', function () {
    const value = this.value.trim().toLowerCase();
    suggestionList.innerHTML = '';
    if (!value || !selectedSide) {
      suggestionList.style.display = 'none';
      return;
    }
    const suggestions = guests
      .filter(g => g.side === selectedSide && g.name.toLowerCase().startsWith(value))
      .slice(0, 6);
    if (suggestions.length === 0) {
      suggestionList.style.display = 'none';
      return;
    }
    suggestions.forEach(g => {
      const item = document.createElement('div');
      item.className = 'list-group-item list-group-item-action';
      item.textContent = g.name;
      item.onclick = () => {
        searchInput.value = g.name;
        suggestionList.innerHTML = '';
        suggestionList.style.display = 'none';
        document.getElementById('searchForm').dispatchEvent(new Event('submit'));
      };
      suggestionList.appendChild(item);
    });
    suggestionList.style.display = 'block';
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => suggestionList.style.display = 'none', 120);
  });
  searchInput.addEventListener('focus', function() {
    if (this.value.trim() && suggestionList.children.length) {
      suggestionList.style.display = 'block';
    }
  });

  document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    suggestionList.innerHTML = '';
    suggestionList.style.display = 'none';
    const input = searchInput.value.trim().toLowerCase();
    if (!input) return;
    let matchedGuests = [];
    if (!isNaN(input)) {
      matchedGuests = guests.filter(g => g.side === selectedSide && g.number.toString() === input);
    } else {
      matchedGuests = guests.filter(g => g.side === selectedSide && g.name.toLowerCase().startsWith(input));
    }
    document.getElementById('searchStep').classList.add('d-none');
    showResult(matchedGuests, input);
  });
}

// Result rendering stays in this file for now
export function showResult(matches, searchVal) {
  const resultStep = document.getElementById('resultStep');
  resultStep.classList.remove('d-none');
  resultStep.innerHTML = '';
  if (matches.length === 0) {
    resultStep.innerHTML = `
      <div class="alert alert-warning text-center" role="alert" style="font-size:1.13rem;">
        Sorry, no match found on the ${selectedSide === 'bride' ? "Bride" : "Groom"}'s side.<br>
        Please check your entry.
      </div>
    `;
    document.getElementById('retryBtnWrapper').classList.remove('d-none');
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
