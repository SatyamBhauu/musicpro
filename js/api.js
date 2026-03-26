const CLIENT_ID = '0f91750f6a66460a94a8c07260626e8c';
const CLIENT_SECRET = 'cae8fd72ccf9414496ad4a3f14d50d31';
// 2. STATE
let accessToken = '';

/**
 * AUTHENTICATION: Client Credentials Flow
 * Returns a 1-hour access token from Spotify
 */
export async function getToken() {
    // Basic Auth header requires base64 encoding of ID:SECRET
    const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        accessToken = data.access_token;
        console.log("🌸 Token Refreshed");
        return accessToken;
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}

/**
 * UTILITY: Centralized Fetcher
 * Handles headers and automatic token refresh logic
 */
async function spotifyFetch(endpoint) {
    if (!accessToken) await getToken();

    const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    // If token expired (401), refresh and retry once
    if (response.status === 401) {
        await getToken();
        return spotifyFetch(endpoint);
    }

    return await response.json();
}

/**
 * HOME: Get Featured Playlists
 */
export async function getFeaturedPlaylists() {
    const data = await spotifyFetch('browse/featured-playlists?limit=12');
    return data.playlists.items;
}

/**
 * DETAIL: Get Tracks from a Playlist
 */
export async function getPlaylistTracks(playlistId) {
    const data = await spotifyFetch(`playlists/${playlistId}/tracks?limit=30`);
    return data.items;
}

/**
 * SEARCH: Get Tracks by Keyword
 */
export async function searchTracks(query) {
    const data = await spotifyFetch(`search?q=${encodeURIComponent(query)}&type=track&limit=20`);
    return data.tracks.items;
}

/**
 * AUDIO SOURCE: The "Music Pro" Secret Sauce
 * Since we don't have Spotify Premium, we prioritize the 30s preview.
 * For full songs, this is where you'd integrate a YouTube-to-Audio proxy.
 */
export function getAudioUrl(track) {
    if (track.preview_url) {
        return track.preview_url;
    }
    // Fallback/Placeholder if no preview exists
    return null;
}
