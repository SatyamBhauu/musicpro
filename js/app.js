import * as api from './api.js';

const playlistGrid = document.getElementById('playlist-grid');

async function initHome() {
    try {
        const playlists = await api.getFeaturedPlaylists();
        
        // Clear loading message
        playlistGrid.innerHTML = '';

        playlists.forEach(playlist => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${playlist.images[0].url}" alt="${playlist.name}" class="card-img">
                <h3 class="card-title">${playlist.name}</h3>
                <p class="track-artist">${playlist.tracks.total} Tracks</p>
            `;
            
            card.onclick = () => loadPlaylist(playlist.id, playlist.name);
            playlistGrid.appendChild(card);
        });
    } catch (error) {
        playlistGrid.innerHTML = `<p>Oops! Make sure to add your API keys in api.js</p>`;
        console.error("API Error:", error);
    }
}

function loadPlaylist(id, name) {
    console.log(`Loading playlist: ${name} (${id})`);
    // We will build the UI Detail view logic in the next step!
}

// Start the app
initHome();
