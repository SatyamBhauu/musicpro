import * as api from './api.js';

const audio = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');

export async function loadTrack(track) {
    // 1. Reset UI to loading state
    document.getElementById('player-title').innerText = "Loading from YouTube...";
    document.getElementById('player-artist').innerText = "Finding best audio... 🌸";
    
    try {
        // 2. Fetch the stream from YouTube using the JioSaavn metadata
        // We use track.searchQuery which we defined in api.js
        const streamUrl = await api.getYouTubeStream(track.searchQuery);

        if (!streamUrl) {
            alert("Could not find this song on YouTube. 🌸");
            document.getElementById('player-title').innerText = "Vibe Check Failed";
            return;
        }

        // 3. Set the source and play
        audio.src = streamUrl;
        
        // Update UI with the JioSaavn info (Name, Artist, Cover)
        document.getElementById('player-title').innerText = track.name;
        document.getElementById('player-artist').innerText = track.artist;
        document.getElementById('player-art').src = track.image;

        audio.play();
        playBtn.innerText = '⏸';

    } catch (err) {
        console.error("Playback Error:", err);
        alert("Something went wrong with the stream. 🛠️");
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
