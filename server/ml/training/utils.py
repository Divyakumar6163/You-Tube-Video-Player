import os
import random

import numpy as np
import torch

ID2LABEL = {
    0: "negative",
    1: "neutral",
    2: "positive",
}
def set_seed(seed: int):
    """
    Make training reproducible.
    """

    random.seed(seed)

    np.random.seed(seed)

    torch.manual_seed(seed)

    if torch.cuda.is_available():

        torch.cuda.manual_seed(seed)

        torch.cuda.manual_seed_all(seed)

    os.environ["PYTHONHASHSEED"] = str(seed)

    torch.backends.cudnn.deterministic = True

    torch.backends.cudnn.benchmark = False


def count_parameters(model):
    """
    Count trainable parameters.
    """

    return sum(
        p.numel()
        for p in model.parameters()
        if p.requires_grad
    )


def print_model_summary(model):

    print("=" * 60)

    print("Model Summary")

    print("=" * 60)

    print(f"Trainable Parameters : {count_parameters(model):,}")

    print("=" * 60)

def id_to_label(prediction_id):
    """
    Convert prediction ID into sentiment label.
    """

    return ID2LABEL.get(
        prediction_id,
        "unknown"
    )