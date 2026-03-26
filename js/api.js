/** MUSIC PRO - JIOSAAVN API MODULE (Working Version) */

// Use this stable Vercel instance
const BASE_URL = 'https://jiosaavn-api-beta.vercel.app'; 

export async function searchTracks(query) {
    console.log("🔍 Searching for:", query);
    try {
        // Updated endpoint: /search/songs
        const res = await fetch(`${BASE_URL}/search/songs?query=${encodeURIComponent(query)}`);
        
        if (!res.ok) throw new Error("API instance is down");
        
        const data = await res.json();

        // The API returns data inside a 'data' object, then 'results' array
        const results = data.data?.results || data.results || [];

        return results.map(song => ({
            id: song.id,
            name: song.name,
            artist: song.primaryArtists || song.artists?.primary[0]?.name || 'Unknown Artist',
            // Get the high-quality 500x500 image
            image: song.image[song.image.length - 1]?.link || song.image[2]?.url || '',
            // Get the 320kbps download link
            downloadUrl: song.downloadUrl[song.downloadUrl.length - 1]?.link || song.downloadUrl[4]?.url || ''
        }));
    } catch (err) {
        console.error("❌ JioSaavn API Error:", err);
        return [];
    }
}
