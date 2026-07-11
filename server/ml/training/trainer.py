import torch
from tqdm import tqdm
from torch.amp import autocast, GradScaler

def train_epoch(
    model,
    dataloader,
    optimizer,
    scheduler,
    device,
):
    model.train()

    total_loss = 0

    scaler = GradScaler(
        device="cuda",
        enabled=device.type == "cuda",
    )

    progress = tqdm(
        dataloader,
        desc="Training",
        leave=False,
    )

    for batch in progress:

        optimizer.zero_grad()

        input_ids = batch["input_ids"].to(device)

        attention_mask = batch["attention_mask"].to(device)

        labels = batch["labels"].to(device)

        with autocast(
            device_type="cuda",
            enabled=device.type == "cuda",
        ):

            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels,
            )

            loss = outputs.loss

        scaler.scale(loss).backward()

        scaler.step(optimizer)

        scaler.update()

        scheduler.step()

        total_loss += loss.item()

        progress.set_postfix(
            loss=f"{loss.item():.4f}"
        )

    return total_loss / len(dataloader)


def validate_epoch(
    model,
    dataloader,
    device,
):
    """
    Compute validation loss.
    """

    model.eval()

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

            labels = batch["labels"].to(device)

            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask,
                labels=labels,
            )

            total_loss += outputs.loss.item()

    return total_loss / len(dataloader)


def save_checkpoint(
    model,
    tokenizer,
    save_directory,
):
    """
    Save the trained model.
    """

    model.save_pretrained(save_directory)

    tokenizer.save_pretrained(save_directory)


def load_checkpoint(
    model,
    checkpoint_directory,
):
    """
    Load model weights.
    """

    state_dict = torch.load(
        f"{checkpoint_directory}/pytorch_model.bin",
        map_location="cpu",
    )

    model.load_state_dict(state_dict)

    return model