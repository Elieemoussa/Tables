// data.js
let guests = [];
let selectedSide = null;

// Fetch guests from JSON
export function fetchGuests() {
  return fetch('/cleint/1.json')
    .then(response => response.json())
    .then(data => { guests = data; });
}
export { guests, selectedSide };
export function setSelectedSide(side) { selectedSide = side; }
