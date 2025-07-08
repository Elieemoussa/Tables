// app.js
import { fetchGuests } from './data.js';
import { setupSideSelection } from './ui.js';
import { setupSearchAndSuggestions } from './search.js';

fetchGuests().then(() => {
  setupSideSelection();
  setupSearchAndSuggestions();
});
