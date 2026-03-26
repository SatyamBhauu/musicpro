import * as api from './api.js';

const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

let ytPlayer; 
let progressInterval;

// YouTube API Setup
window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('main-audio-player', {
        height: '0', width: '0', videoId: '',
        playerVars: { 'autoplay': 0, 'controls': 0, 'playsinline': 1 },
        events: {
            'onStateChange': (event) => {
                if (event.data === YT.PlayerState.PLAYING) {
                    playBtn.innerText = '⏸';
                    startProgressUpdate();
                } else {
                    playBtn.innerText = '▶';
                    clearInterval(progressInterval);
                }
            },
            'onError': (e) => {
                console.error("YT Player Error:", e.data);
                alert("YouTube blocked this playback. Try another song! 🌸");
            }
        }
    });
};

export async function loadTrack(track) {
    document.getElementById('player-title').innerText = "Searching YouTube...";
    document.getElementById('player-artist').innerText = "Bypassing restrictions... 🌸";

    const videoId = await api.getYouTubeVideoId(track.searchQuery);

    if (videoId && ytPlayer) {
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-artist').innerText = track.artist;
        document.getElementById('player-art').src = track.image;

        ytPlayer.loadVideoById(videoId);
    } else {
        document.getElementById('player-title').innerText = "Connection Failed";
        document.getElementById('player-artist').innerText = "Check your internet or try again.";
        console.error("Failed to retrieve a Video ID.");
    }
}

export function togglePlay() {
    if (!ytPlayer) return;
    const state = ytPlayer.getPlayerState();
    state === 1 ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
}

function startProgressUpdate() {
    progressInterval = setInterval(() => {
        const current = ytPlayer.getCurrentTime();
        const duration = ytPlayer.getDuration();
        if (duration > 0) {
            progressBar.value = (current / duration) * 100;
            currentTimeEl.innerText = formatTime(current);
            durationTimeEl.innerText = formatTime(duration);
        }
    }, 1000);
}

progressBar.oninput = () => {
    const time = (progressBar.value / 100) * ytPlayer.getDuration();
    ytPlayer.seekTo(time, true);
};

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}
