/** MUSIC PRO - JIOSAAVN + YOUTUBE HYBRID API */

const JIO_BASE_URL = 'https://jiosaavn-api-beta.vercel.app'; 
const YOUTUBE_PROXY = 'https://pipedapi.kavin.rocks'; 

// STEP 1: Get song metadata from JioSaavn
export async function searchTracks(query) {
    try {
        const res = await fetch(`${JIO_BASE_URL}/search/songs?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        const results = data.data?.results || data.results || [];

        return results.map(song => ({
            name: song.name,
            artist: song.primaryArtists || song.artists?.primary[0]?.name || 'Unknown Artist',
            image: song.image[song.image.length - 1]?.link || song.image[2]?.url || '',
            // We keep the title/artist to search YouTube later
            searchQuery: `${song.name} ${song.primaryArtists || ''} official audio`
        }));
    } catch (err) {
        console.error("❌ JioSaavn Search Error:", err);
        return [];
    }
}

// STEP 2: Find the YouTube Audio Stream using the JioSaavn info
export async function getYouTubeStream(searchQuery) {
    try {
        // Search YouTube via Piped
        const searchRes = await fetch(`${YOUTUBE_PROXY}/search?q=${encodeURIComponent(searchQuery)}&filter=videos`);
        const searchData = await searchRes.json();
        const videoId = searchData.content[0]?.videoId;

        if (!videoId) return null;

        // Get the actual audio stream link
        const streamRes = await fetch(`${YOUTUBE_PROXY}/streams/${videoId}`);
        const streamData = await streamRes.json();
        
        // Pick the best audio-only stream
        const audioStream = streamData.audioStreams.find(s => s.mimeType.includes('audio/webm')) || streamData.audioStreams[0];
        return audioStream.url;
    } catch (err) {
        console.error("❌ YouTube Stream Error:", err);
        return null;
    }
}
