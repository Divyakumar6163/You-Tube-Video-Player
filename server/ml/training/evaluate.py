from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
)

import torch
from tqdm import tqdm


def evaluate(model, dataloader, device):

    model.eval()

    predictions = []

    labels = []

    total_loss = 0

    with torch.no_grad():

        progress = tqdm(
            dataloader,
            desc="Validation",
            leave=False
        )

        for batch in progress:

            input_ids = batch["input_ids"].to(device)

            attention_mask = batch["attention_mask"].to(device)

            target = batch["labels"].to(device)

            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=target,
            )

            total_loss += outputs.loss.item()

            preds = torch.argmax(
                outputs.logits,
                dim=1
            )

            predictions.extend(
                preds.cpu().numpy()
            )

            labels.extend(
                target.cpu().numpy()
            )

    avg_loss = total_loss / len(dataloader)

    accuracy = accuracy_score(
        labels,
        predictions,
    )

    precision, recall, f1, _ = (
        precision_recall_fscore_support(
            labels,
            predictions,
            average="weighted",
            zero_division=0,
        )
    )

    cm = confusion_matrix(
        labels,
        predictions,
    )

    metrics = {
        "loss": avg_loss,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "confusion_matrix": cm,
    }

    return metrics