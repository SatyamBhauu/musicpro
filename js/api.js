/** MUSIC PRO - API MODULE (JioSaavn + YouTube ID Scraper) */

const JIO_API_URL = 'https://jiosaavn-api-beta.vercel.app'; 
const CORS_PROXY = 'https://corsproxy.io/?'; 

/**
 * SEARCH: Gets song metadata from JioSaavn
 */
export async function searchTracks(query) {
    try {
        const res = await fetch(`${JIO_API_URL}/search/songs?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        const results = data.data?.results || data.results || [];

        return results.map(song => ({
            name: song.name,
            artist: song.primaryArtists || 'Unknown Artist',
            image: song.image[song.image.length - 1]?.link || song.image[2]?.url || '',
            // We create a clean query to find the video on YouTube
            searchQuery: `${song.name} ${song.primaryArtists || ''} official audio`
        }));
    } catch (err) {
        console.error("❌ JioSaavn Search Error:", err);
        return [];
    }
}

/**
 * YOUTUBE ID: Finds a Video ID without using a heavy API key
 */
export async function getYouTubeVideoId(searchQuery) {
    try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(`${CORS_PROXY}${encodeURIComponent(searchUrl)}`);
        const html = await response.text();

        // Scrape the first videoId from the YouTube search results page
        const videoIdMatch = html.match(/"videoId":"([^"]+)"/);
        return videoIdMatch ? videoIdMatch[1] : null;
    } catch (err) {
        console.error("❌ YouTube ID Scrape Error:", err);
        return null;
    }
}
