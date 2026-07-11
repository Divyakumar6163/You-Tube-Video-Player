const axios = require("axios");

// --------------------------------------
// YouTube API Key
// --------------------------------------
console.log(
  "Loading YouTube API Key from environment variables...",
  process.env.YOUTUBE_API_KEY,
);
const API_KEY = process.env.YOUTUBE_API_KEY;

// --------------------------------------
// Remove HTML Tags
// --------------------------------------

const getPlainText = (html) => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
};

// --------------------------------------
// Fetch ALL comments
// --------------------------------------

const fetchAllComments = async (videoId) => {
  let comments = [];
  let pageToken = "";

  try {
    while (true) {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        {
          params: {
            part: "snippet",
            videoId,
            maxResults: 100,
            pageToken,
            key: API_KEY,
          },
        },
      );
      console.log(
        `Fetched ${response.data.items.length} comments from YouTube API.`,
      );
      const items = response.data.items || [];

      const currentComments = items
        .map((item) => {
          const text = item?.snippet?.topLevelComment?.snippet?.textDisplay;

          if (!text) return null;

          return getPlainText(text);
        })
        .filter(
          (comment) => typeof comment === "string" && comment.trim().length > 0,
        );

      comments.push(...currentComments);
      if (!response.data.nextPageToken) {
        break;
      }

      pageToken = response.data.nextPageToken;
    }

    console.log(`Fetched ${comments.length} comments from YouTube.`);
    console.log("First 5 comments:");
    console.log(comments.slice(0, 5));

    console.log(
      "Invalid comments:",
      comments.filter((c) => typeof c !== "string"),
    );
    return comments;
  } catch (error) {
    console.error(
      "Error fetching YouTube comments:",
      error.response?.data || error.message,
    );

    throw new Error("Failed to fetch comments from YouTube.");
  }
};

module.exports = {
  fetchAllComments,
};
