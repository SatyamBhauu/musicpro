/** MUSIC PRO - SUPABASE API MODULE */

const SUPABASE_URL = 'https://vyfffwclpmxmrhnuvrod.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZmZmd2NscG14bXJobnV2cm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjEwNDIsImV4cCI6MjA5MDA5NzA0Mn0.8fDhfAIF5QuvROZey1_0tUuY13uX5rWJOkaXwe0yZ-Y'; // Make sure this is your ACTUAL key
const BUCKET_NAME = 'Music';

export async function fetchMyLibrary() {
    try {
        const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            // The 400 error often happens if 'prefix' is missing or null
            body: JSON.stringify({
                prefix: '', 
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' }
            })
        });

        const files = await response.json();

        // 1. Check if files is actually an array before mapping
        if (!Array.isArray(files)) {
            console.error("Supabase returned an error object instead of a list:", files);
            return [];
        }

        // 2. Filter out things that aren't music (like folders or .placeholder files)
        return files
            .filter(file => file.name.endsWith('.mp3'))
            .map(file => {
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${file.name}`;
                return {
                    name: file.name.replace('.mp3', ''),
                    artist: "My Library",
                    image: "https://via.placeholder.com/300/FFB6C1/5A5A5A?text=My+Music",
                    downloadUrl: publicUrl
                };
            });
    } catch (err) {
        console.error("Supabase Fetch Error:", err);
        return [];
    }
}
