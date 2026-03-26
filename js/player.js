/** * MUSIC PRO - PLAYER ENGINE (Supabase Edition)
 * Uses native HTML5 Audio for direct .mp3 streaming
 */

const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
const volumeSlider = document.getElementById('volume-slider');

export const playerState = {
    isPlaying: false,
    currentTrack: null
};

/**
 * LOAD: Sets the audio source and updates the UI
 * @param {Object} track - The song object from Supabase
 */
export async function loadTrack(track) {
    if (!track.downloadUrl) {
        console.error("❌ No download URL found for this track.");
        return;
    }

    // 1. Set the source to your Supabase Public URL
    audio.src = track.downloadUrl;
    playerState.currentTrack = track;

    // 2. Update the "Now Playing" UI
    document.getElementById('player-title').innerText = track.name;
    document.getElementById('player-artist').innerText = track.artist;
    document.getElementById('player-art').src = track.image;

    // 3. Play the song
    playTrack();
}

export function playTrack() {
    audio.play()
        .then(() => {
            playerState.isPlaying = true;
            playBtn.innerText = '⏸'; // Change to Pause icon
        })
        .catch(err => {
            console.error("Play blocked by browser:", err);
            // Most browsers require a click before audio plays
        });
}

export function pauseTrack() {
    audio.pause();
    playerState.isPlaying = false;
    playBtn.innerText = '▶'; // Change back to Play icon
}

export function togglePlay() {
    if (!audio.src) return;
    playerState.isPlaying ? pauseTrack() : playTrack();
}

/**
 * TIME & PROGRESS LOGIC
 */

// Update progress bar and timers as the song plays
audio.ontimeupdate = () => {
    if (!audio.duration) return;
    
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    
    currentTimeEl.innerText = formatTime(audio.currentTime);
    durationTimeEl.innerText = formatTime(audio.duration);
};

// Seek song when dragging the progress bar
progressBar.oninput = () => {
    if (!audio.duration) return;
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
};

// Volume Control
if (volumeSlider) {
    volumeSlider.oninput = (e) => {
        audio.volume = e.target.value;
    };
}

/**
 * UTILS
 */
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Handle song ending (Auto-stop)
audio.onended = () => {
    pauseTrack();
    progressBar.value = 0;
    currentTimeEl.innerText = "0:00";
};
