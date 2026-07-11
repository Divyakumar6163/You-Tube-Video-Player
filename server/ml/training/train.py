import torch

from torch.optim import AdamW
from torch.utils.data import DataLoader

from transformers import get_linear_schedule_with_warmup

from dataset import load_datasets
from model import build_model
from trainer import (
    train_epoch,
    validate_epoch,
    save_checkpoint,
)
from evaluate import evaluate
from utils import (
    set_seed,
    print_model_summary,
)
from config import (
    MODEL_DIR,
    BATCH_SIZE,
    EPOCHS,
    LEARNING_RATE,
    EARLY_STOPPING_PATIENCE,
)


def main():

    # ------------------------------------
    # Device
    # ------------------------------------

    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )
    from config import RANDOM_SEED
    set_seed(RANDOM_SEED)
    print(f"\nUsing Device : {device}\n")

    # ------------------------------------
    # Dataset
    # ------------------------------------

    train_dataset, valid_dataset, test_dataset, tokenizer = load_datasets()

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
    )

    valid_loader = DataLoader(
        valid_dataset,
        batch_size=BATCH_SIZE,
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=BATCH_SIZE,
    )

    print(f"Training Samples   : {len(train_dataset)}")
    print(f"Validation Samples : {len(valid_dataset)}")
    print(f"Testing Samples    : {len(test_dataset)}")

    # ------------------------------------
    # Model
    # ------------------------------------

    model = build_model()
    print_model_summary(model)
    model.to(device)

    optimizer = AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
    )

    total_steps = len(train_loader) * EPOCHS

    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=0,
        num_training_steps=total_steps,
    )

    best_validation_loss = float("inf")
    patience_counter = 0
    # ------------------------------------
    # Training Loop
    # ------------------------------------

    for epoch in range(EPOCHS):

        print("\n" + "=" * 60)
        print(f"Epoch {epoch + 1}/{EPOCHS}")
        print("=" * 60)

        train_loss = train_epoch(
            model=model,
            dataloader=train_loader,
            optimizer=optimizer,
            scheduler=scheduler,
            device=device,
        )

        validation_loss = validate_epoch(
            model=model,
            dataloader=valid_loader,
            device=device,
        )

        metrics = evaluate(
            model=model,
            dataloader=valid_loader,
            device=device,
        )

        print(f"\nTraining Loss   : {train_loss:.4f}")
        print(f"Validation Loss : {validation_loss:.4f}")

        print(f"Accuracy  : {metrics['accuracy']:.4f}")
        print(f"Precision : {metrics['precision']:.4f}")
        print(f"Recall    : {metrics['recall']:.4f}")
        print(f"F1 Score  : {metrics['f1']:.4f}")

        if validation_loss < best_validation_loss:

            best_validation_loss = validation_loss
            patience_counter = 0
            save_checkpoint(
                model,
                tokenizer,
                MODEL_DIR,
            )

            print("\n✅ Best model saved.")
        else:

            patience_counter += 1

            print(
                f"\nValidation did not improve "
                f"({patience_counter}/"
                f"{EARLY_STOPPING_PATIENCE})"
            )

            if patience_counter >= EARLY_STOPPING_PATIENCE:

                print("\nEarly stopping triggered.")

                break
    # ------------------------------------
    # Final Evaluation
    # ------------------------------------

    print("\n" + "=" * 60)
    print("Final Test Evaluation")
    print("=" * 60)

    test_metrics = evaluate(
        model=model,
        dataloader=test_loader,
        device=device,
    )

    print(f"Accuracy  : {test_metrics['accuracy']:.4f}")
    print(f"Precision : {test_metrics['precision']:.4f}")
    print(f"Recall    : {test_metrics['recall']:.4f}")
    print(f"F1 Score  : {test_metrics['f1']:.4f}")

    print("\nTraining Completed Successfully.")


if __name__ == "__main__":
    main()