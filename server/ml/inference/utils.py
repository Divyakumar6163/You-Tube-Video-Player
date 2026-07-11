from collections import Counter


# ==========================================
# Label Mapping
# ==========================================

ID2LABEL = {
    0: "negative",
    1: "neutral",
    2: "positive",
}

LABEL2RATING = {
    "negative": 1,
    "neutral": 3,
    "positive": 5,
}

def id_to_label(prediction_id):
    """
    Convert prediction ID into sentiment label.
    """

    return ID2LABEL.get(
        prediction_id,
        "unknown",
    )
# ==========================================
# Count Predictions
# ==========================================

def count_predictions(predictions):
    """
    Convert prediction IDs into sentiment counts.

    Example:
    [2,2,1,0,2]

    ->
    {
        "positive":3,
        "neutral":1,
        "negative":1
    }
    """

    labels = [ID2LABEL[p] for p in predictions]

    counts = Counter(labels)

    return {
        "positive": counts.get("positive", 0),
        "neutral": counts.get("neutral", 0),
        "negative": counts.get("negative", 0),
    }


# ==========================================
# Calculate Percentages
# ==========================================

def calculate_percentages(counts):

    total = sum(counts.values())

    if total == 0:
        return {
            "positive": 0,
            "neutral": 0,
            "negative": 0,
        }

    return {
        "positive": round(
            counts["positive"] * 100 / total,
            2,
        ),
        "neutral": round(
            counts["neutral"] * 100 / total,
            2,
        ),
        "negative": round(
            counts["negative"] * 100 / total,
            2,
        ),
    }


# ==========================================
# Rating Generator
# ==========================================

def calculate_rating(counts):
    """
    Convert sentiments into a rating out of 5.

    Positive -> 5

    Neutral -> 3

    Negative -> 1
    """

    total = sum(counts.values())

    if total == 0:
        return 0

    score = (
        counts["positive"] * 5
        + counts["neutral"] * 3
        + counts["negative"] * 1
    )

    rating = score / total

    return round(rating, 2)


# ==========================================
# Overall Sentiment
# ==========================================

def overall_sentiment(counts):

    if (
        counts["positive"] >= counts["neutral"]
        and counts["positive"] >= counts["negative"]
    ):
        return "Positive"

    if (
        counts["negative"] >= counts["positive"]
        and counts["negative"] >= counts["neutral"]
    ):
        return "Negative"

    return "Neutral"