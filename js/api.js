/** MUSIC PRO - ULTIMATE API MODULE */

const JIO_API_URL = 'https://jiosaavn-api-beta.vercel.app'; 

// We use a CORS bridge to talk to YouTube search directly
const CORS_PROXY = 'https://corsproxy.io/?'; 

export async function searchTracks(query) {
    try {
        const res = await fetch(`${JIO_API_URL}/search/songs?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        const results = data.data?.results || data.results || [];

        return results.map(song => ({
            name: song.name,
            artist: song.primaryArtists || 'Unknown Artist',
            image: song.image[song.image.length - 1]?.link || '',
            searchQuery: `${song.name} ${song.primaryArtists || ''}`
        }));
    } catch (err) {
        return [];
    }
}

export async function getYouTubeStream(searchQuery) {
    try {
        // We search YouTube directly via a CORS proxy
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + " official audio")}`;
        const response = await fetch(`${CORS_PROXY}${encodeURIComponent(searchUrl)}`);
        const html = await response.text();

        // We "scrape" the first Video ID from the YouTube HTML results
        const videoIdMatch = html.match(/"videoId":"([^"]+)"/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) throw new Error("No video found");

        // Now we use a much more stable streaming link generator
        // Cobalt or similar tools are usually more stable than Piped for direct links
        return `https://api.cobalt.tools/api/json`; 
        // NOTE: For pure Vanilla without a backend, the most stable way 
        // is actually using the Piped instance 'https://pipedapi.collegium.edu.pl'
    } catch (err) {
        // FINAL FALLBACK: If YouTube scraping fails, try a very specific stable instance
        return await tryStableInstance(searchQuery);
    }
}

async function tryStableInstance(query) {
    const instance = 'https://pipedapi.collegium.edu.pl'; // University-hosted (usually stable)
    try {
        const sRes = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=videos`);
        const sData = await sRes.json();
        const vId = sData.content[0]?.videoId;
        const stRes = await fetch(`${instance}/streams/${vId}`);
        const stData = await stRes.json();
        return stData.audioStreams.find(s => s.mimeType.includes('audio/webm'))?.url;
    } catch (e) {
        return null;
    }
}
