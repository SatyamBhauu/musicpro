import * as api from './api.js';
import * as player from './player.js';

const searchInput = document.getElementById('global-search');
const searchView = document.getElementById('search-view');
const homeView = document.getElementById('home-view');
const detailView = document.getElementById('detail-view');
const searchResultsGrid = document.getElementById('search-results-grid');

let searchTimeout = null;

searchInput.oninput = (e) => {
    const query = e.target.value;
    
    clearTimeout(searchTimeout);
    if (query.length < 3) {
        if (query.length === 0) backToHome();
        return;
    }

    searchTimeout = setTimeout(async () => {
        const tracks = await api.searchTracks(query);
        renderSearchResults(tracks);
    }, 500); // Wait 500ms after user stops typing
};

function renderSearchResults(tracks) {
    homeView.classList.add('hidden');
    detailView.classList.add('hidden');
    searchView.classList.remove('hidden');
    
    searchResultsGrid.innerHTML = '';
    tracks.forEach((track, index) => {
        const row = document.createElement('div');
        row.className = 'track-row';
        row.innerHTML = `
            <div class="track-number"><img src="${track.album.images[2]?.url}" style="width:30px; border-radius:5px;"></div>
            <div class="track-title-cell">${track.name}</div>
            <div class="track-artist-cell">${track.artists[0].name}</div>
            <div class="track-duration">${track.preview_url ? '🎵' : '🚫'}</div>
        `;
        row.onclick = () => player.loadTrack(track);
        searchResultsGrid.appendChild(row);
    });
}

function backToHome() {
    searchView.classList.add('hidden');
    detailView.classList.add('hidden');
    homeView.classList.remove('hidden');
    searchInput.value = '';
}

document.getElementById('nav-home-btn').onclick = backToHome;
