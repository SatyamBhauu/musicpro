import * as api from './api.js';

const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');

export async function loadTrack(track) {
    // 1. Show "Searching..." state
    document.getElementById('player-title').innerText = "Finding on YouTube...";
    document.getElementById('player-artist').innerText = "Please wait 🌸";

    // 2. Fetch the YouTube stream using JioSaavn's song info
    const streamUrl = await api.getYouTubeStream(track.searchQuery);

    if (streamUrl) {
        audio.src = streamUrl;
        
        // 3. Update UI with the original JioSaavn details
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-artist').innerText = track.artist;
        document.getElementById('player-art').src = track.image;

        audio.play().catch(() => alert("Click Play to start!"));
        playBtn.innerText = '⏸';
    } else {
        alert("Could not find this song on YouTube.");
        document.getElementById('player-title').innerText = "Error";
    }
}
