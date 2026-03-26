import * as api from './api.js';
import * as player from './player.js';

const playlistGrid = document.getElementById('playlist-grid');

async function initLibrary() {
    playlistGrid.innerHTML = '<p class="status-msg">Opening your vault... 🌸</p>';
    
    const mySongs = await api.fetchMyLibrary();

    if (mySongs.length === 0) {
        playlistGrid.innerHTML = '<p class="status-msg">Bucket is empty! Upload some .mp3s first. ✨</p>';
        return;
    }

    playlistGrid.innerHTML = ''; // Clear loading message

    mySongs.forEach(song => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${song.image}" class="card-img">
            <h3 class="card-title">${song.name}</h3>
            <p class="track-artist">${song.artist}</p>
        `;
        
        // When clicked, use our standard player logic
        card.onclick = () => player.loadTrack(song);
        playlistGrid.appendChild(card);
    });
}

// Start the app by loading your Supabase files
initLibrary();
