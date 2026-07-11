import pandas as pd
import torch

from sklearn.model_selection import train_test_split
from torch.utils.data import Dataset

from transformers import AutoTokenizer

from config import (
    DATASET_FILE,
    MODEL_NAME,
    MAX_LENGTH,
    LABEL2ID,
    RANDOM_SEED,
    TRAIN_SIZE,
)


class YoutubeCommentsDataset(Dataset):
    """
    PyTorch Dataset for YouTube Comments.
    """

    def __init__(self, texts, labels, tokenizer):

        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, index):

        text = str(self.texts[index])

        label = self.labels[index]

        encoding = self.tokenizer(
            text,
            truncation=True,
            padding="max_length",
            max_length=MAX_LENGTH,
            return_tensors="pt",
        )

        return {
            "input_ids": encoding["input_ids"].squeeze(0),
            "attention_mask": encoding["attention_mask"].squeeze(0),
            "labels": torch.tensor(label, dtype=torch.long),
        }


# ======================================================
# Dataset Loader
# ======================================================

def load_datasets():

    if not DATASET_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found: {DATASET_FILE}"
        )

    print("=" * 60)
    print("Loading Dataset...")
    print("=" * 60)

    df = pd.read_csv(DATASET_FILE)

    print(f"Total Samples : {len(df)}")

    # ---------------------------------------------------
    # Validate Required Columns
    # ---------------------------------------------------

    required_columns = ["Comment", "Sentiment"]

    for column in required_columns:

        if column not in df.columns:
            raise ValueError(
                f"Missing required column: {column}"
            )

    # ---------------------------------------------------
    # Data Cleaning
    # ---------------------------------------------------

    df = df.dropna(subset=["Comment", "Sentiment"])

    df["Comment"] = (
        df["Comment"]
        .astype(str)
        .str.strip()
    )

    df["Sentiment"] = (
        df["Sentiment"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    # Keep only valid labels
    df = df[df["Sentiment"].isin(LABEL2ID.keys())]

    print(f"Remaining Samples : {len(df)}")

    # ---------------------------------------------------
    # Label Encoding
    # ---------------------------------------------------

    df["label"] = df["Sentiment"].map(LABEL2ID)

    # ---------------------------------------------------
    # Train / Validation / Test Split
    # ---------------------------------------------------

    train_df, temp_df = train_test_split(
        df,
        train_size=TRAIN_SIZE,
        random_state=RANDOM_SEED,
        stratify=df["label"],
    )

    valid_df, test_df = train_test_split(
        temp_df,
        test_size=0.5,
        random_state=RANDOM_SEED,
        stratify=temp_df["label"],
    )

    print(f"Training Samples   : {len(train_df)}")
    print(f"Validation Samples : {len(valid_df)}")
    print(f"Testing Samples    : {len(test_df)}")

    # ---------------------------------------------------
    # Tokenizer
    # ---------------------------------------------------

    print("\nLoading Tokenizer...")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    # ---------------------------------------------------
    # Create Dataset Objects
    # ---------------------------------------------------

    train_dataset = YoutubeCommentsDataset(
        train_df["Comment"].tolist(),
        train_df["label"].tolist(),
        tokenizer,
    )

    valid_dataset = YoutubeCommentsDataset(
        valid_df["Comment"].tolist(),
        valid_df["label"].tolist(),
        tokenizer,
    )

    test_dataset = YoutubeCommentsDataset(
        test_df["Comment"].tolist(),
        test_df["label"].tolist(),
        tokenizer,
    )

    return (
        train_dataset,
        valid_dataset,
        test_dataset,
        tokenizer,
    )