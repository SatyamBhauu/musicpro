/** * MUSIC PRO - API MODULE (Pure YouTube/Piped Version)
 * No API Keys Required 🌸
 */

const BASE_URL = 'https://pipedapi.kavin.rocks'; 

export async function searchTracks(query) {
    try {
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&filter=videos`);
        const data = await res.json();
        
        // Map YouTube results to a format our app understands
        return data.content.map(item => ({
            name: item.title,
            artist: item.uploaderName,
            image: item.thumbnail,
            id: item.videoId,
            duration: item.duration // in seconds
        }));
    } catch (err) {
        console.error("Search failed:", err);
        return [];
    }
}

export async function getAudioStream(videoId) {
    try {
        const res = await fetch(`${BASE_URL}/streams/${videoId}`);
        const data = await res.json();
        
        // Find the best audio-only stream
        const audioStream = data.audioStreams.find(s => s.mimeType.includes('audio/webm')) || data.audioStreams[0];
        return audioStream.url;
    } catch (err) {
        console.error("Stream fetch failed:", err);
        return null;
    }
}
