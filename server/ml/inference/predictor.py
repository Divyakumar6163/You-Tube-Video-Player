import unicodedata
from pathlib import Path
import sys
import torch
from utils import id_to_label
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
)

# ==========================================
# Paths
# ==========================================

CURRENT_DIR = Path(__file__).resolve().parent

MODEL_NAME = "Divya-Kumar/youtube-sentiment-distilbert"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)


DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print(
    f"Loading model on {DEVICE}",
    file=sys.stderr,
)

model.to(DEVICE)

model.eval()

print(
    "Model Loaded Successfully.",
    file=sys.stderr,
)

def clean_comment(text):
    """
    Clean malformed unicode and invisible characters.
    """

    if text is None:
        return ""

    text = str(text)

    # Remove invalid unicode surrogates
    text = text.encode(
        "utf-8",
        errors="ignore"
    ).decode(
        "utf-8",
        errors="ignore"
    )

    # Normalize unicode
    text = unicodedata.normalize(
        "NFKC",
        text,
    )

    return text.strip()
class SentimentPredictor:

    def __init__(
        self,
        batch_size=32,
    ):

        self.batch_size = batch_size

    def predict(
        self,
        comments,
    ):
        """
        Predict sentiment for a list of comments.

        Returns:
        [
            {
                "prediction": 2,
                "confidence": 98.42
            },
            ...
        ]
        """
        comments = [
            clean_comment(comment)
            for comment in comments
        ]

        comments = [
            c
            for c in comments
            if c
        ]
        predictions = []

        with torch.no_grad():

            for i in range(
                0,
                len(comments),
                self.batch_size,
            ):

                batch = [
                    comment[:1000]
                    for comment in comments[i:i+self.batch_size]
                ]

                for comment in comments[i:i+self.batch_size]:

                    try:

                        comment = clean_comment(comment)

                        tokenizer(comment)

                        batch.append(comment)

                    except Exception:

                        print(
                            f"Skipping invalid comment: {repr(comment)}",
                            file=sys.stderr,
                        )
                try:
                    encoding = tokenizer(
                        batch,
                        truncation="longest_first",
                        max_length=128,
                        padding=True,
                        return_tensors="pt",
                    )
                except Exception:
                    print("Batch failed!", file=sys.stderr)

                    for idx, comment in enumerate(batch):
                        try:
                            tokenizer(comment)
                        except Exception as e:
                            print(
                                f"Bad comment at index {i + idx}: {repr(comment)}",
                                file=sys.stderr,
                            )
                            raise

                    raise
                input_ids = encoding["input_ids"].to(DEVICE)

                attention_mask = encoding["attention_mask"].to(DEVICE)

                outputs = model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                )

                # ------------------------------------
                # Softmax Probabilities
                # ------------------------------------

                probabilities = torch.softmax(
                    outputs.logits,
                    dim=1,
                )

                confidence, prediction = torch.max(
                    probabilities,
                    dim=1,
                )

                for pred, conf in zip(
                    prediction.cpu().tolist(),
                    confidence.cpu().tolist(),
                ):

                    predictions.append(
                        {
                            "prediction": pred,
                            "label": id_to_label(pred),
                            "confidence": round(
                                conf * 100,
                                2,
                            ),
                        }
                    )

        return predictions