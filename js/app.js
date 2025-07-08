// app.js
import { fetchGuests, guests } from './data.js';
import { setupSideSelection } from './ui.js';
import { setupSearchAndSuggestions } from './search.js';

fetchGuests().then(() => {
  setupSideSelection();
  setupSearchAndSuggestions();
});


document.getElementById('tableMapBtn').addEventListener('click', function() {
  const modal = new bootstrap.Modal(document.getElementById('tableMapModal'));
  modal.show();
});

document.getElementById('guestListBtn').addEventListener('click', function() {
  renderGuestList();
  const modal = new bootstrap.Modal(document.getElementById('guestListModal'));
  modal.show();
});


function renderGuestList() {
  // Group and sort guests
  const brideGuests = guests.filter(g => g.side === 'bride').sort((a, b) => a.name.localeCompare(b.name));
  const groomGuests = guests.filter(g => g.side === 'groom').sort((a, b) => a.name.localeCompare(b.name));
  
  // HTML for each side
  const makeList = (titleEn, titleAr, arr, color) => `
    <div class="col-md-6">
      <h6 class="fw-bold text-${color} mb-1">${titleEn}</h6>
      <div class="small mb-2" dir="rtl" style="color:#888;">${titleAr}</div>
      <ul class="list-group list-group-flush small">
        ${arr.map(g => `<li class="list-group-item d-flex justify-content-between align-items-center py-2">
          <span>${g.name}</span>
          <span class="badge rounded-pill bg-light text-dark border" style="font-size:0.95em;">
            Table ${g.table}
          </span>
        </li>`).join('')}
      </ul>
    </div>
  `;

  document.getElementById('guestListBody').innerHTML = 
    makeList("Bride Side", "طرف العروس", brideGuests, "danger") +
    makeList("Groom Side", "طرف العريس", groomGuests, "primary");
}

