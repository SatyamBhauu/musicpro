import * as api from './api.js';

// Elements
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

let ytPlayer; // This will hold the YouTube IFrame instance
let progressInterval;

// 1. Initialize the YouTube IFrame API
// This function is called automatically by the YouTube Script
window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('main-audio-player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1
        },
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': () => console.log("🌸 YouTube Player Ready")
        }
    });
};

// 2. Load the YouTube API Script into the page
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

export async function loadTrack(track) {
    // UI Update
    document.getElementById('player-title').innerText = "Connecting...";
    document.getElementById('player-artist').innerText = "Tuning the vibe... 🌸";

    try {
        // Get Video ID from our API (using the direct YouTube Scraper/Search)
        const videoId = await api.getYouTubeVideoId(track.searchQuery);

        if (!videoId) {
            alert("Could not find this song on YouTube.");
            return;
        }

        // Update UI with JioSaavn Metadata
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-artist').innerText = track.artist;
        document.getElementById('player-art').src = track.image;

        // Tell YouTube to play the video
        ytPlayer.loadVideoById(videoId);
        playBtn.innerText = '⏸';
        
        startProgressTimer();
    } catch (err) {
        console.error("Playback Error:", err);
        alert("Something went wrong with the connection. 🛠️");
    }
}

function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === 1) {
        playBtn.innerText = '⏸';
    } else {
        playBtn.innerText = '▶';
    }
}

export function togglePlay() {
    const state = ytPlayer.getPlayerState();
    if (state === 1) {
        ytPlayer.pauseVideo();
    } else {
        ytPlayer.playVideo();
    }
}

// 3. Progress Tracking
function startProgressTimer() {
    if (progressInterval) clearInterval(progressInterval);
    
    progressInterval = setInterval(() => {
        if (ytPlayer && ytPlayer.getCurrentTime) {
            const current = ytPlayer.getCurrentTime();
            const duration = ytPlayer.getDuration();
            
            if (duration > 0) {
                const progress = (current / duration) * 100;
                progressBar.value = progress;
                currentTimeEl.innerText = formatTime(current);
                durationTimeEl.innerText = formatTime(duration);
            }
        }
    }, 1000);
}

// Seek functionality
progressBar.oninput = () => {
    const seekTo = (progressBar.value / 100) * ytPlayer.getDuration();
    ytPlayer.seekTo(seekTo, true);
};

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
