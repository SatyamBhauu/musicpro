/** MUSIC PRO - JIOSAAVN API MODULE */

// This is a common public wrapper base URL. 
// Note: These public instances can sometimes go down.
const BASE_URL = 'https://saavn.dev/api'; 

export async function searchTracks(query) {
    console.log("🔍 Searching JioSaavn for:", query);
    try {
        // We use the /search/songs endpoint
        const res = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!data.success || data.data.results.length === 0) {
            return [];
        }

        // Map JioSaavn data to our app's format
        return data.data.results.map(song => ({
            id: song.id,
            name: song.name,
            artist: song.artists.primary[0]?.name || 'Unknown Artist',
            // JioSaavn provides multiple qualities, we take the 500x500 image
            image: song.image[2]?.url || song.image[0]?.url,
            // We store the highest quality download link for the player
            downloadUrl: song.downloadUrl[4]?.url || song.downloadUrl[2]?.url
        }));
    } catch (err) {
        console.error("❌ JioSaavn API Error:", err);
        return null;
    }
}
