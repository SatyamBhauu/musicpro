import * as api from './api.js';

const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');

export async function loadTrack(track) {
    // Reset UI to show we are working
    document.getElementById('player-title').innerText = "Connecting...";
    document.getElementById('player-artist').innerText = "Bypassing CORS... 🌸";
    
    // Try to get the stream
    const streamUrl = await api.getYouTubeStream(track.searchQuery);

    if (streamUrl) {
        audio.src = streamUrl;
        
        // Success: Update with song details
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-artist').innerText = track.artist;
        document.getElementById('player-art').src = track.image;

        audio.play().catch(e => console.error("Playback block:", e));
        playBtn.innerText = '⏸';
    } else {
        // Failure: Reset UI
        alert("All music servers are busy right now. Please try again in a moment! 🌸");
        document.getElementById('player-title').innerText = "Vibe Interrupted";
        document.getElementById('player-artist').innerText = "Try another song";
    }
}
