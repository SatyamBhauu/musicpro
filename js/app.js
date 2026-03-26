import * as api from './api.js';
import * as player from './player.js';

const searchInput = document.getElementById('global-search');
const searchResultsGrid = document.getElementById('search-results-grid');
const searchView = document.getElementById('search-view');
const homeView = document.getElementById('home-view');

searchInput.onkeydown = async (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value;
        if (!query) return;

        // Switch Views
        homeView.classList.add('hidden');
        searchView.classList.remove('hidden');
        searchResultsGrid.innerHTML = '<p class="loading-msg">Searching the clouds... ☁️</p>';

        const tracks = await api.searchTracks(query);
        renderResults(tracks);
    }
};

function renderResults(tracks) {
    searchResultsGrid.innerHTML = '';
    
    tracks.forEach(track => {
        const row = document.createElement('div');
        row.className = 'track-row';
        row.innerHTML = `
            <img src="${track.image}" class="tiny-art">
            <div class="track-info-cell">
                <div class="track-title-cell">${track.name}</div>
                <div class="track-artist-cell">${track.artist}</div>
            </div>
        `;
        row.onclick = () => player.loadTrack(track);
        searchResultsGrid.appendChild(row);
    });
}

// Global Play/Pause
document.getElementById('play-btn').onclick = () => player.togglePlay();
