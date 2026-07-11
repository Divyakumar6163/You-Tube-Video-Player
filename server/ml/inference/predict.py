import json
import sys
import traceback

from predictor import SentimentPredictor

from utils import (
    count_predictions,
    calculate_percentages,
    calculate_rating,
    overall_sentiment,
)


def main():
    try:

        # ----------------------------------
        # Read Input
        # ----------------------------------

        print("Waiting for input...", file=sys.stderr)

        raw_data = sys.stdin.read().strip()

        print(f"Received {len(raw_data)} characters.", file=sys.stderr)

        if not raw_data:
            raise ValueError("No input received from Node.js.")

        data = json.loads(raw_data)

        comments = data.get("comments", [])

        if not isinstance(comments, list):
            raise ValueError("comments must be a list.")

        if len(comments) == 0:
            raise ValueError("No comments received.")

        print(f"Received {len(comments)} comments.", file=sys.stderr)
        print(f"First Comment: {repr(comments[0])}", file=sys.stderr)

        # ----------------------------------
        # Prediction
        # ----------------------------------

        predictor = SentimentPredictor()

        predictions = predictor.predict(comments)

        prediction_ids = [
            p["prediction"]
            for p in predictions
        ]

        confidences = [
            p["confidence"]
            for p in predictions
        ]

        # ----------------------------------
        # Statistics
        # ----------------------------------

        counts = count_predictions(prediction_ids)

        percentages = calculate_percentages(counts)

        rating = calculate_rating(counts)

        sentiment = overall_sentiment(counts)

        average_confidence = round(
            sum(confidences) / len(confidences),
            2,
        )

        result = {
            "success": True,
            "rating": rating,
            "overallSentiment": sentiment,
            "averageConfidence": average_confidence,
            "totalComments": len(comments),
            "positive": counts["positive"],
            "neutral": counts["neutral"],
            "negative": counts["negative"],
            "positivePercentage": percentages["positive"],
            "neutralPercentage": percentages["neutral"],
            "negativePercentage": percentages["negative"],
            "predictions": predictions,
        }

        print(json.dumps(result))

    except Exception as e:

        # FULL TRACEBACK
        traceback.print_exc(file=sys.stderr)

        print(
            json.dumps(
                {
                    "success": False,
                    "error": str(e),
                }
            )
        )


if __name__ == "__main__":
    main()