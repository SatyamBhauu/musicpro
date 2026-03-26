import * as api from './api.js';

// DOM Elements
const homeView = document.getElementById('home-view');
const detailView = document.getElementById('detail-view');
const playlistGrid = document.getElementById('playlist-grid');
const trackListContainer = document.getElementById('track-list');
const backBtn = document.getElementById('back-btn');

// View Switching Logic
async function showPlaylistDetail(playlistId, playlistName, playlistImg) {
    homeView.classList.add('hidden');
    detailView.classList.remove('hidden');

    // Update Header
    document.getElementById('detail-title').innerText = playlistName;
    document.getElementById('detail-img').src = playlistImg;
    trackListContainer.innerHTML = '<p class="loading-msg">Fetching tracks...</p>';

    try {
        const tracks = await api.getPlaylistTracks(playlistId);
        renderTracks(tracks);
    } catch (err) {
        trackListContainer.innerHTML = '<p>Could not load tracks.</p>';
    }
}

function renderTracks(items) {
    trackListContainer.innerHTML = '';
    items.forEach((item, index) => {
        const track = item.track;
        const row = document.createElement('div');
        row.className = 'track-row';
        row.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="track-title-cell">${track.name}</div>
            <div class="track-artist-cell">${track.artists[0].name}</div>
            <div class="track-duration">${msToTime(track.duration_ms)}</div>
        `;
        
        row.onclick = () => {
            // This is where we will trigger the Player Engine later
            console.log("Playing:", track.name);
        };
        
        trackListContainer.appendChild(row);
    });
}

// Utility: Convert MS to MM:SS
function msToTime(s) {
    const min = Math.floor(s / 60000);
    const sec = ((s % 60000) / 1000).toFixed(0);
    return min + ":" + (sec < 10 ? '0' : '') + sec;
}

// Event Listeners
backBtn.onclick = () => {
    detailView.classList.add('hidden');
    homeView.classList.remove('hidden');
};

// Update the initHome to include the click event
async function initHome() {
    const playlists = await api.getFeaturedPlaylists();
    playlistGrid.innerHTML = '';
    playlists.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.images[0].url}" class="card-img">
            <h3 class="card-title">${p.name}</h3>
        `;
        card.onclick = () => showPlaylistDetail(p.id, p.name, p.images[0].url);
        playlistGrid.appendChild(card);
    });
}

initHome();
