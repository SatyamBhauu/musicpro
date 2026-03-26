const CLIENT_ID = '0f91750f6a66460a94a8c07260626e8c';
const CLIENT_SECRET = 'cae8fd72ccf9414496ad4a3f14d50d31';
let accessToken = '';

/**
 * AUTH: Gets Spotify Access Token
 */
export async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
}

/**
 * SPOTIFY: Fetch Featured Playlists
 */
export async function getFeaturedPlaylists() {
    if (!accessToken) await getToken();
    const res = await fetch('https://api.spotify.com/v1/browse/featured-playlists?limit=12', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await res.json();
    return data.playlists.items;
}

/**
 * SPOTIFY: Get Playlist Tracks
 */
export async function getPlaylistTracks(playlistId) {
    const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await res.json();
    return data.items;
}

/**
 * SPOTIFY: Search Tracks
 */
export async function searchTracks(query) {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await res.json();
    return data.tracks.items;
}

/**
 * YOUTUBE: Find Audio Stream
 * This bypasses Spotify's "Preview Restriction" by searching YouTube
 */
export async function getYoutubeStream(trackName, artistName) {
    try {
        const query = encodeURIComponent(`${trackName} ${artistName} audio`);
        // We use a public Piped instance API to find the video and stream
        const searchRes = await fetch(`https://pipedapi.kavin.rocks/search?q=${query}&filter=videos`);
        const searchData = await searchRes.json();
        
        const videoId = searchData.content[0]?.videoId;
        if (!videoId) return null;

        const streamRes = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        const streamData = await streamRes.json();
        
        // Return the best audio-only stream URL
        const audioStream = streamData.audioStreams.find(s => s.mimeType.includes('audio/webm')) || streamData.audioStreams[0];
        return audioStream.url;
    } catch (err) {
        console.error("Stream Fetch Error:", err);
        return null;
    }
}
