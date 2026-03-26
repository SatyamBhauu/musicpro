const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');

export const playerState = {
    isPlaying: false,
    currentTrack: null,
    queue: []
};

export function loadTrack(track) {
    if (!track.preview_url) {
        alert("No preview available for this track! (Spotify restriction)");
        return;
    }

    playerState.currentTrack = track;
    audio.src = track.preview_url;
    
    // Update UI
    document.getElementById('player-title').innerText = track.name;
    document.getElementById('player-artist').innerText = track.artists[0].name;
    document.getElementById('player-art').src = track.album.images[0].url;

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
    if (playerState.isPlaying) pauseTrack();
    else playTrack();
}

// Time Updating Logic
audio.ontimeupdate = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress || 0;
    currentTimeEl.innerText = formatTime(audio.currentTime);
    if (audio.duration) durationTimeEl.innerText = formatTime(audio.duration);
};

// Seek Logic
progressBar.oninput = () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
};

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
