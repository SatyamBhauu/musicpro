import * as api from './api.js';

const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

export const playerState = {
    isPlaying: false,
    currentTrack: null
};

/**
 * LOAD: Fetches YouTube audio and updates player UI
 */
export async function loadTrack(track) {
    // 1. Update UI to "Loading" state
    document.getElementById('player-title').innerText = "Loading...";
    document.getElementById('player-artist').innerText = "Finding audio source...";
    
    // 2. Get YouTube Stream
    const streamUrl = await api.getYoutubeStream(track.name, track.artists[0].name);

    if (!streamUrl) {
        alert("Could not find audio for this song 🌸");
        document.getElementById('player-title').innerText = "Error";
        return;
    }

    // 3. Set Audio Source and Play
    audio.src = streamUrl;
    playerState.currentTrack = track;

    // 4. Final UI Update with Spotify Metadata
    document.getElementById('player-title').innerText = track.name;
    document.getElementById('player-artist').innerText = track.artists[0].name;
    document.getElementById('player-art').src = track.album?.images[0]?.url || '';

    playTrack();
}

export function playTrack() {
    audio.play();
    playerState.isPlaying = true;
    playBtn.innerText = '⏸';
}

export function pauseTrack() {
    audio.pause();
    playerState.isPlaying = false;
    playBtn.innerText = '▶';
}

export function togglePlay() {
    if (!audio.src) return;
    playerState.isPlaying ? pauseTrack() : playTrack();
}

// Update Progress Bar as song plays
audio.ontimeupdate = () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.innerText = formatTime(audio.currentTime);
    durationTimeEl.innerText = formatTime(audio.duration);
};

// Seek song when dragging progress bar
progressBar.oninput = () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
};

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
