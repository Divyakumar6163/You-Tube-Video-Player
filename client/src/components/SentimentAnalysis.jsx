import React from "react";
import style from "../css/sentimentAnalysis.module.css";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useState } from "react";
const RatingStars = ({ rating }) => {
  const stars = [];

  const fullStars = Math.floor(rating);

  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;

  const roundedFull = rating - fullStars >= 0.75 ? fullStars + 1 : fullStars;

  for (let i = 1; i <= 5; i++) {
    if (i <= roundedFull && !hasHalfStar) {
      stars.push(<FaStar key={i} className={style.starFilled} />);
    } else if (i <= fullStars) {
      stars.push(<FaStar key={i} className={style.starFilled} />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className={style.starFilled} />);
    } else {
      stars.push(<FaRegStar key={i} className={style.starEmpty} />);
    }
  }

  return <div className={style.starContainer}>{stars}</div>;
};
const SentimentAnalysis = ({ videoId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleAnalyzeSentiment = async () => {
    try {
      setLoading(true);

      console.log("Analyzing video...");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/sentiment`,
        {
          videoId,
        },
      );

      console.log(response.data);
      setAnalysis(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={style.container}>
      <div className={style.header}>
        {/* <h2>Sentiment Analysis</h2> */}
        <button
          className={style.button}
          onClick={handleAnalyzeSentiment}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </button>
        {analysis && (
          <div>
            <RatingStars rating={analysis.rating} />
            <span className={style.ratingText}>
              {analysis.rating.toFixed(1)} Rated
            </span>
          </div>
        )}
      </div>

      {!analysis && (
        <div className={style.empty}>
          <p>
            Click <strong>Analyze Sentiment</strong> to analyze all YouTube
            comments using the trained AI model.
          </p>
        </div>
      )}

      {analysis && (
        <div className={style.card}>
          <div className={style.details}>
            <div className={style.sentimentGrid}>
              <div className={style.sentimentCard}>
                <div className={style.sentimentHeader}>
                  <span>😊 Positive</span>
                  <strong>{analysis.positivePercentage}%</strong>
                </div>

                <div className={style.bar}>
                  <div
                    className={style.positive}
                    style={{
                      width: `${analysis.positivePercentage}%`,
                    }}
                  />
                </div>

                <small>{analysis.positive} Comments</small>
              </div>

              <div className={style.sentimentCard}>
                <div className={style.sentimentHeader}>
                  <span>😐 Neutral</span>
                  <strong>{analysis.neutralPercentage}%</strong>
                </div>

                <div className={style.bar}>
                  <div
                    className={style.neutral}
                    style={{
                      width: `${analysis.neutralPercentage}%`,
                    }}
                  />
                </div>

                <small>{analysis.neutral} Comments</small>
              </div>

              <div className={style.sentimentCard}>
                <div className={style.sentimentHeader}>
                  <span>😞 Negative</span>
                  <strong>{analysis.negativePercentage}%</strong>
                </div>

                <div className={style.bar}>
                  <div
                    className={style.negative}
                    style={{
                      width: `${analysis.negativePercentage}%`,
                    }}
                  />
                </div>

                <small>{analysis.negative} Comments</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
