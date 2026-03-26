/** MUSIC PRO - API MODULE (Stabilized YouTube Version) */

// Use a different stable instance
const BASE_URL = 'https://pipedapi.kavin.rocks'; 

export async function searchTracks(query) {
    console.log("🔍 Searching for:", query);
    try {
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&filter=videos`);
        
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        
        if (!data.content || data.content.length === 0) {
            console.warn("No results found on YouTube.");
            return [];
        }

        return data.content.map(item => ({
            name: item.title,
            artist: item.uploaderName,
            image: item.thumbnail,
            id: item.videoId
        }));
    } catch (err) {
        console.error("❌ Search API Error:", err);
        return null; // Return null so we can show an error message in UI
    }
}

export async function getAudioStream(videoId) {
    try {
        const res = await fetch(`${BASE_URL}/streams/${videoId}`);
        const data = await res.json();
        const audioStream = data.audioStreams.find(s => s.mimeType.includes('audio/webm')) || data.audioStreams[0];
        return audioStream.url;
    } catch (err) {
        console.error("❌ Stream Error:", err);
        return null;
    }
}
