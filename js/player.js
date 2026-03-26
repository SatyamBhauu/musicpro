import * as api from './api.js';

const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');

export async function loadTrack(track) {
    // UI Loading State
    document.getElementById('player-title').innerText = "Loading...";
    document.getElementById('player-artist').innerText = "Fetching stream...";

    const streamUrl = await api.getAudioStream(track.id);

    if (streamUrl) {
        audio.src = streamUrl;
        
        // Update UI with Track Info
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-artist').innerText = track.artist;
        document.getElementById('player-art').src = track.image;
        
        audio.play();
        playBtn.innerText = '⏸';
    } else {
        alert("Couldn't play this one. Try another! ✨");
    }
}

export function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = '⏸';
    } else {
        audio.pause();
        playBtn.innerText = '▶';
    }
}
