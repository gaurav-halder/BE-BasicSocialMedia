// instagram.js
const axios = require('axios');

const instagramGraphApiBaseUrl = 'https://graph.instagram.com';

// Function to score each post based on its metrics
function scorePost(likes, comments) {
  const weightLikes = 1;
  const weightComments = 2;
  return (likes * weightLikes) + (comments * weightComments);
}

// Function to fetch media and calculate scores
async function fetchMediaAndCalculateScores(accessToken) {
  try {
    const response = await axios.get(`${instagramGraphApiBaseUrl}/me/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,comments_count,like_count',
        access_token: accessToken
      }
    });

    const media = response.data.data;
    const scoredMedia = media.map(post => ({
      ...post,
      score: scorePost(post.like_count, post.comments_count)
    }));
    scoredMedia.sort((a, b) => b.score - a.score);

    return scoredMedia;
  } catch (error) {
    console.error("Error fetching Instagram media:", error);
    throw error; // It's generally a good idea to throw the error so it can be caught and handled by the caller
  }
}

module.exports = {
  fetchMediaAndCalculateScores
};
