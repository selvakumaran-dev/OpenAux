const axios = require('axios');

/**
 * Search YouTube and filter by banned keywords
 * @param {string} query - Search query
 * @param {string[]} bannedKeywords - Array of banned words
 * @returns {Promise<Array>} Filtered search results
 */
async function searchYouTubeWithFilter(query, bannedKeywords = []) {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    if (!YOUTUBE_API_KEY) {
        throw new Error('YouTube API key not configured');
    }

    try {
        // Step 1: Search for videos
        const searchResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    videoCategoryId: '10', // Music category
                    maxResults: 20,
                    key: YOUTUBE_API_KEY
                }
            }
        );

        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

        // Step 2: Get video details (including tags and duration)
        const detailsResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/videos',
            {
                params: {
                    part: 'snippet,contentDetails',
                    id: videoIds,
                    key: YOUTUBE_API_KEY
                }
            }
        );

        // Step 3: Filter by banned keywords
        const filtered = detailsResponse.data.items.filter(video => {
            const title = video.snippet.title.toLowerCase();
            const description = video.snippet.description.toLowerCase();
            const tags = (video.snippet.tags || []).map(tag => tag.toLowerCase());

            // Check if any banned keyword exists in title, description, or tags
            const hasBannedContent = bannedKeywords.some(keyword => {
                const lowerKeyword = keyword.toLowerCase();
                return (
                    title.includes(lowerKeyword) ||
                    description.includes(lowerKeyword) ||
                    tags.some(tag => tag.includes(lowerKeyword))
                );
            });

            return !hasBannedContent;
        });

        // Step 4: Format results
        return filtered.map(video => ({
            youtubeId: video.id,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            duration: formatDuration(video.contentDetails.duration),
            channelTitle: video.snippet.channelTitle
        }));
    } catch (error) {
        console.error('YouTube API Error:', error.response?.data || error.message);
        throw new Error('Failed to search YouTube');
    }
}

/**
 * Convert ISO 8601 duration to readable format (e.g., PT3M45S → 3:45)
 */
function formatDuration(isoDuration) {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

module.exports = { searchYouTubeWithFilter };
