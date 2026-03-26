/** MUSIC PRO - API MODULE (Robust Scraper) */

const JIO_API_URL = 'https://jiosaavn-api-beta.vercel.app'; 

// Primary and Secondary Proxies
const PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/get?url='
];

export async function searchTracks(query) {
    try {
        const res = await fetch(`${JIO_API_URL}/search/songs?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        const results = data.data?.results || data.results || [];

        return results.map(song => ({
            name: song.name,
            artist: song.primaryArtists || 'Unknown Artist',
            image: song.image[song.image.length - 1]?.link || song.image[2]?.url || '',
            searchQuery: `${song.name} ${song.primaryArtists || ''} official audio`
        }));
    } catch (err) {
        console.error("❌ JioSaavn Search Error:", err);
        return [];
    }
}

export async function getYouTubeVideoId(searchQuery) {
    const targetUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    
    for (const proxy of PROXIES) {
        try {
            console.log(`📡 Trying Proxy: ${proxy}`);
            let html = "";

            if (proxy.includes('allorigins')) {
                const res = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`);
                const data = await res.json();
                html = data.contents;
            } else {
                const res = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`);
                html = await res.text();
            }

            // Improved Regex to find the videoId
            const regex = /"videoId":"([^"]{11})"/;
            const match = html.match(regex);
            
            if (match && match[1]) {
                console.log("✅ Found Video ID:", match[1]);
                return match[1];
            }
        } catch (err) {
            console.warn(`⚠️ Proxy ${proxy} failed, trying next...`);
        }
    }
    return null;
}
