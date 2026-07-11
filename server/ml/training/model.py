from transformers import AutoModelForSequenceClassification

from config import (
    MODEL_NAME,
    LABEL2ID,
    ID2LABEL,
)


def build_model():
    """
    Load a pretrained DistilBERT model
    and replace its classifier head
    for our sentiment classification task.
    """

    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,

        num_labels=len(LABEL2ID),

        id2label=ID2LABEL,

        label2id=LABEL2ID,
    )

    return model