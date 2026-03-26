import * as api from './api.js';

const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

let ytPlayer; 
let progressInterval;

// Initialize YouTube API
window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('main-audio-player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'playsinline': 1
        },
        events: {
            'onStateChange': (event) => {
                // Change Play/Pause icon based on state
                if (event.data === YT.PlayerState.PLAYING) {
                    playBtn.innerText = '⏸';
                    startProgressUpdate();
                } else {
                    playBtn.innerText = '▶';
                    clearInterval(progressInterval);
                }
            },
            'onReady': () => console.log("🌸 YouTube Engine Ready")
        }
    });
};

// Load YT Script
if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
}

export async function loadTrack(track) {
    document.getElementById('player-title').innerText = "Searching...";
    document.getElementById('player-artist').innerText = "Fetching vibe... 🌸";

    const videoId = await api.getYouTubeVideoId(track.searchQuery);

    if (videoId && ytPlayer) {
        // Update UI Metadata
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-artist').innerText = track.artist;
        document.getElementById('player-art').src = track.image;

        // Play the video in the hidden iframe
        ytPlayer.loadVideoById(videoId);
    } else {
        alert("Couldn't connect to the music stream. 🛠️");
    }
}

export function togglePlay() {
    if (!ytPlayer) return;
    const state = ytPlayer.getPlayerState();
    state === YT.PlayerState.PLAYING ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
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
