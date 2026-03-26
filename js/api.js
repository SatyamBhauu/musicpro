const CLIENT_ID = '0f91750f6a66460a94a8c07260626e8c';
const CLIENT_SECRET = 'cae8fd72ccf9414496ad4a3f14d50d31';

// If you encounter CORS issues with the streaming source later, 
// you can prepend a proxy like 'https://cors-anywhere.herokuapp.com/'
const PROXY_URL = ''; 

let accessToken = '';

/**
 * Gets the Access Token from Spotify using Client Credentials Flow
 */
export async function getToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    accessToken = data.access_token;
    return accessToken;
}

/**
 * Fetches Featured Playlists for the Home Screen
 */
export async function getFeaturedPlaylists() {
    if (!accessToken) await getToken();

    const result = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?limit=10`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.playlists.items;
}

/**
 * Fetches specific tracks from a playlist
 */
export async function getPlaylistTracks(playlistId) {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await result.json();
    return data.items;
}
