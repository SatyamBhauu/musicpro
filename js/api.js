/** * MUSIC PRO - HYBRID API MODULE 
 * Metadata: JioSaavn | Audio: YouTube (via Piped Proxy)
 */

// Stable JioSaavn Instance for metadata
const JIO_API_URL = 'https://jiosaavn-api-beta.vercel.app'; 

// Array of Piped instances to bypass CORS and 502 errors
const YOUTUBE_INSTANCES = [
    'https://pipedapi.lunar.icu',
    'https://pipedapi.darkness.services',
    'https://api.piped.victr.me',
    'https://pipedapi.kavin.rocks'
];

/**
 * SEARCH: Fetches song metadata from JioSaavn
 */
export async function searchTracks(query) {
    console.log("🌸 Searching JioSaavn for:", query);
    try {
        const res = await fetch(`${JIO_API_URL}/search/songs?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("JioSaavn API unreachable");
        
        const data = await res.json();
        const results = data.data?.results || data.results || [];

        return results.map(song => ({
            name: song.name,
            artist: song.primaryArtists || 'Unknown Artist',
            image: song.image[song.image.length - 1]?.link || song.image[2]?.url || '',
            // Create a specific string to find the exact version on YouTube
            searchQuery: `${song.name} ${song.primaryArtists || ''} official audio`
        }));
    } catch (err) {
        console.error("❌ Search Error:", err);
        return [];
    }
}

/**
 * STREAM: Finds a working YouTube audio link from multiple instances
 */
export async function getYouTubeStream(searchQuery) {
    for (const instance of YOUTUBE_INSTANCES) {
        try {
            console.log(`📡 Trying YouTube Proxy: ${instance}`);
            
            // 1. Search for the video ID
            const searchRes = await fetch(`${instance}/search?q=${encodeURIComponent(searchQuery)}&filter=videos`);
            if (!searchRes.ok) continue;
            
            const searchData = await searchRes.json();
            const videoId = searchData.content[0]?.videoId;
            if (!videoId) continue;

            // 2. Fetch the stream data for that ID
            const streamRes = await fetch(`${instance}/streams/${videoId}`);
            if (!streamRes.ok) continue;
            
            const streamData = await streamRes.json();
            
            // 3. Find the best audio-only stream (WebM usually works best)
            const audioStream = streamData.audioStreams.find(s => s.mimeType.includes('audio/webm')) 
                                || streamData.audioStreams[0];
            
            if (audioStream?.url) {
                console.log("✅ Success! Stream found.");
                return audioStream.url;
            }
        } catch (err) {
            console.warn(`⚠️ Instance ${instance} failed. Trying next...`);
        }
    }
    
    console.error("❌ All YouTube instances failed.");
    return null;
}
