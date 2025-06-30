let guests = [];

// Fetch guest list from JSON
fetch('/cleint/1.json')
  .then(response => response.json())
  .then(data => {
    guests = data;
  })
  .catch(err => {
    document.getElementById("result").innerHTML = `
      <div class="alert alert-danger">Could not load guest list.</div>
    `;
  });

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Search functionality (partial match)
document.getElementById("searchForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (!input) return;

  let matchedGuests = [];
  // If input is a number, find by number
  if (!isNaN(input)) {
    matchedGuests = guests.filter(g => g.number.toString() === input);
  }
  // If input is text, find all names that start with input
  else {
    matchedGuests = guests.filter(g => g.name.toLowerCase().startsWith(input));
  }

  if (matchedGuests.length === 0) {
    resultDiv.innerHTML = `
      <div class="alert alert-warning text-center" role="alert">
        Sorry, no match found. Please check your name or number.
      </div>
    `;
    return;
  }

  // Show all matched guests
  matchedGuests.forEach(guest => {
    resultDiv.innerHTML += `
      <div class="card p-4 shadow mb-3 ${guest.side === 'bride' ? 'bride' : 'groom'}">
        <h3 class="mb-3 text-center">${guest.name}</h3>
        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item"><strong>Guest Number:</strong> ${guest.number}</li>
          <li class="list-group-item"><strong>Table:</strong> ${guest.table}</li>
          <li class="list-group-item"><strong>Family/Group Count:</strong> ${guest.familyCount}</li>
          <li class="list-group-item"><strong>Side:</strong>
            <span class="fw-bold text-${guest.side === 'bride' ? 'danger' : 'primary'}">
              ${capitalize(guest.side)}
            </span>
          </li>
        </ul>
        <div class="text-center">
          <span class="badge bg-${guest.side === 'bride' ? 'danger' : 'primary'} fs-5 px-3 py-2">
            ${capitalize(guest.side)}'s Side
          </span>
        </div>
      </div>
    `;
  });
});
