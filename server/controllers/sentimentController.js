const { analyzeComments } = require("../services/sentimentService");
const { fetchAllComments } = require("../services/youtubeService");

const analyzeSentiment = async (req, res) => {
  try {
    const { videoId } = req.body;

    // -----------------------------------
    // Validate Request
    // -----------------------------------

    if (!videoId || typeof videoId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid videoId is required.",
      });
    }

    console.log("\n========================================");
    console.log("Sentiment Analysis Started");
    console.log("========================================");
    console.log(`Video ID: ${videoId}`);

    // -----------------------------------
    // Fetch Comments
    // -----------------------------------

    console.time("Fetch Comments");

    const comments = await fetchAllComments(videoId);

    console.timeEnd("Fetch Comments");

    if (!comments.length) {
      return res.status(404).json({
        success: false,
        message: "No comments found for this video.",
      });
    }

    console.log(`Fetched ${comments.length} comments.`);

    // -----------------------------------
    // Run Prediction
    // -----------------------------------

    console.time("ML Prediction");

    const prediction = await analyzeComments(comments);

    console.timeEnd("ML Prediction");

    console.log("Prediction completed successfully.");
    console.log("========================================\n");

    return res.status(200).json(prediction);

  } catch (error) {

    console.error("\n========== Sentiment Analysis Error ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  analyzeSentiment,
};