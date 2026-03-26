import * as api from './api.js';

const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

export async function loadTrack(track) {
    console.log("🎵 Attempting to play:", track.name);
    console.log("🔗 Audio Link:", track.downloadUrl);

    if (!track.downloadUrl) {
        alert("Sorry, no high-quality audio link found for this song. 🌸");
        return;
    }

    try {
        // 1. Reset and Load
        audio.pause();
        audio.src = track.downloadUrl;
        audio.load(); // Forces the browser to buffer the new source

        // 2. Update the UI
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-artist').innerText = track.artist;
        document.getElementById('player-art').src = track.image;

        // 3. Play (Wrapped in a promise to catch browser blocks)
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                playBtn.innerText = '⏸';
                console.log("✅ Playing successfully!");
            }).catch(error => {
                console.error("❌ Playback blocked or failed:", error);
                alert("Click the Play button manually to start! Browsers sometimes block auto-play.");
            });
        }
    } catch (err) {
        console.error("❌ Error in loadTrack:", err);
    }
}

export function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) {
        audio.play();
        playBtn.innerText = '⏸';
    } else {
        audio.pause();
        playBtn.innerText = '▶';
    }
}

// Time/Progress logic
audio.ontimeupdate = () => {
    if (!audio.duration) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.innerText = formatTime(audio.currentTime);
    durationTimeEl.innerText = formatTime(audio.duration);
};

progressBar.oninput = () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
};

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
