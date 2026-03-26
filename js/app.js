import * as api from './api.js';
import * as player from './player.js';

// ... (previous showPlaylistDetail and renderTracks code) ...

function renderTracks(items) {
    const trackListContainer = document.getElementById('track-list');
    trackListContainer.innerHTML = '';
    
    items.forEach((item, index) => {
        const track = item.track;
        const row = document.createElement('div');
        row.className = 'track-row';
        row.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="track-title-cell">${track.name}</div>
            <div class="track-artist-cell">${track.artists[0].name}</div>
            <div class="track-duration">Preview</div>
        `;
        
        row.onclick = () => player.loadTrack(track);
        trackListContainer.appendChild(row);
    });
}

// Global Player Controls
document.getElementById('play-btn').onclick = () => player.togglePlay();
document.getElementById('volume-slider').oninput = (e) => {
    document.getElementById('main-audio-player').volume = e.target.value;
};

initHome();
