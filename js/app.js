import * as api from './api.js';
import * as player from './player.js';

const searchInput = document.getElementById('global-search');
const searchResultsGrid = document.getElementById('search-results-grid');
const searchView = document.getElementById('search-view');
const homeView = document.getElementById('home-view');

searchInput.onkeydown = async (e) => {
    // Check if user pressed Enter
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (!query) return;

        // 1. Show the search screen and a loading message
        homeView.classList.add('hidden');
        searchView.classList.remove('hidden');
        searchResultsGrid.innerHTML = '<p class="status-msg">Searching the clouds... ☁️</p>';

        try {
            // 2. Fetch from the API
            const tracks = await api.searchTracks(query);

            // 3. Check if tracks exist
            if (!tracks || tracks.length === 0) {
                searchResultsGrid.innerHTML = '<p class="status-msg">No songs found. Try a different name! 🌸</p>';
                return;
            }

            // 4. Clear the "Searching..." message and show results
            renderResults(tracks);

        } catch (error) {
            console.error("Search Error:", error);
            searchResultsGrid.innerHTML = '<p class="status-msg">Oops! The connection dropped. Try again. 🛠️</p>';
        }
    }
};

function renderResults(tracks) {
    const searchResultsGrid = document.getElementById('search-results-grid');
    searchResultsGrid.innerHTML = ''; 

    tracks.forEach(track => {
        const row = document.createElement('div');
        row.className = 'track-row';
        row.innerHTML = `
            <img src="${track.image}" class="tiny-art" onerror="this.src='https://via.placeholder.com/55'">
            <div class="track-info-cell">
                <div class="track-title-cell">${track.name}</div>
                <div class="track-artist-cell">${track.artist}</div>
            </div>
        `;
        row.onclick = () => player.loadTrack(track);
        searchResultsGrid.appendChild(row);
    });
}
