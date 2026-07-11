from pathlib import Path

# ==========================================
# Project Directories
# ==========================================

ROOT_DIR = Path(__file__).resolve().parent.parent

DATASET_DIR = ROOT_DIR / "dataset"

MODEL_DIR = ROOT_DIR / "models" / "distilbert_youtube_sentiment"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

EARLY_STOPPING_PATIENCE = 2
# ==========================================
# Dataset
# ==========================================

DATASET_FILE = DATASET_DIR / "YoutubeCommentsDataSet.csv"

TEXT_COLUMN = "Comment"

LABEL_COLUMN = "Sentiment"

# ==========================================
# HuggingFace Model
# ==========================================

MODEL_NAME = "distilbert-base-uncased"

# ==========================================
# Training Hyperparameters
# ==========================================

MAX_LENGTH = 128

BATCH_SIZE = 8

LEARNING_RATE = 2e-5

EPOCHS = 2

RANDOM_SEED = 42

# ==========================================
# Dataset Split
# ==========================================

TRAIN_SIZE = 0.8

VALID_SIZE = 0.1

TEST_SIZE = 0.1

# ==========================================
# Labels
# ==========================================

LABEL2ID = {
    "negative": 0,
    "neutral": 1,
    "positive": 2
}

ID2LABEL = {
    0: "negative",
    1: "neutral",
    2: "positive"
}