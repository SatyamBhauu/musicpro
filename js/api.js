/** MUSIC PRO - SUPABASE API MODULE */

// Replace with your actual project details from Supabase Settings -> API
const SUPABASE_URL = 'https://vyfffwclpmxmrhnuvrod.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZmZmd2NscG14bXJobnV2cm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjEwNDIsImV4cCI6MjA5MDA5NzA0Mn0.8fDhfAIF5QuvROZey1_0tUuY13uX5rWJOkaXwe0yZ-Y';
const BUCKET_NAME = 'Music';

export async function fetchMyLibrary() {
    try {
        // We call the 'list' endpoint to see all files in the bucket
        const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: '', // Leave empty to get all files
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' }
            })
        });

        const files = await response.json();

        // Convert the file list into our "Music Pro" song format
        return files.map(file => {
            // This is the direct public URL for the audio file
            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${file.name}`;
            
            return {
                name: file.name.replace('.mp3', ''), // Remove extension for display
                artist: "My Library",
                image: "https://via.placeholder.com/300/FFB6C1/5A5A5A?text=My+Music", // Default cute cover
                downloadUrl: publicUrl
            };
        });
    } catch (err) {
        console.error("Supabase Fetch Error:", err);
        return [];
    }
}
