import * as api from './api.js';

const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');

export function loadTrack(track) {
    if (!track.downloadUrl) {
        alert("Audio not available for this track 🌸");
        return;
    }

    // Set the source directly from the JioSaavn data
    audio.src = track.downloadUrl;
    
    // Update UI
    document.getElementById('player-title').innerText = track.name;
    document.getElementById('player-artist').innerText = track.artist;
    document.getElementById('player-art').src = track.image;

    audio.play();
    playBtn.innerText = '⏸';
}
