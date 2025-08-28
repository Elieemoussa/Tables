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

  // Group and sort guests by table, then name
  const brideGuests = guests
    .filter(g => g.side === 'bride')
    .sort((a, b) => a.table - b.table || a.name.localeCompare(b.name));

  const groomGuests = guests
    .filter(g => g.side === 'groom')
    .sort((a, b) => a.table - b.table || a.name.localeCompare(b.name));
  // helper: sum familyCount safely
  const totalPeople = arr => arr.reduce((sum, g) => sum + (Number(g.familyCount) || 0), 0);

    // build per-table totals (overall, both sides)
  const tableTotals = guests.reduce((acc, g) => {
    const t = Number(g.table);
    const c = Number(g.familyCount) || 0;
    acc[t] = (acc[t] || 0) + c;
    return acc;
  }, {});
  const sortedTables = Object.keys(tableTotals).map(Number).sort((a, b) => a - b);

  // HTML for each side (note: color is used inline, not as a Bootstrap text-* class)
  const makeList = (titleEn, arr, colorHex) => `
    <div class="col-md-6 guest-list">
      <h6 class="fw-bold mb-2" style="color:${colorHex};">${titleEn}</h6>
      <ul class="list-group list-group-flush small">
        ${arr.map(g => `
          <li class="list-group-item d-flex justify-content-between align-items-center py-2">
            <span>${g.name}</span>
            <span class="badge rounded-pill bg-light text-dark border" style="font-size:0.95em;">
              Table ${g.table}
            </span>
          </li>
        `).join('')}
        <li class="list-group-item d-flex justify-content-between align-items-center py-2 fw-semibold">
          <span>Total People</span>
          <span>${totalPeople(arr)}</span>
        </li>
      </ul>
    </div>
  `;

  // Render both columns
  const body = document.getElementById('guestListBody');
  body.innerHTML =
    makeList("Bride Side", brideGuests, "#ecccb2") +
    makeList("Groom Side", groomGuests, "#a4b0b9");

  // Grand totals row (full width)
  const grandTotal = totalPeople(brideGuests) + totalPeople(groomGuests);
  const grandEntries = brideGuests.length + groomGuests.length;
  body.insertAdjacentHTML('beforeend', `
    <div class="col-12 mt-3">
      <div class="alert alert-light border d-flex justify-content-between align-items-center mb-0">
        <div class="fw-semibold">Totals</div>
        <div class="small">
          <span class="me-3">Entries: <strong>${grandEntries}</strong></span>
          <span>People: <strong>${grandTotal}</strong></span>
        </div>
      </div>
    </div>
  `);

    // people per table (overall)
  body.insertAdjacentHTML('beforeend', `
    <div class="col-12 mt-3">
      <h6 class="fw-bold mb-2">People per Table</h6>
      <div class="row g-2">
        ${sortedTables.map(t => `
          <div class="col-6 col-md-4 col-lg-3">
            <div class="d-flex justify-content-between align-items-center border rounded px-3 py-2">
              <span>Table ${t}</span>
              <span class="badge bg-light text-dark border">${tableTotals[t]}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `);
}




