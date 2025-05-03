import pandas as pd
import json
from transformers import pipeline

# Load CSV file
csv_path = "data/dreams.csv"
df = pd.read_csv(csv_path)
dreams = df["dreams_text"].dropna().tolist()

# Load the emotion classification pipeline
emotion_pipeline = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)

# Define the emotion → emoji mapping
EMOTION_EMOJIS = {
    "admiration": "👏", "amusement": "😄", "anger": "😠", "annoyance": "😒",
    "approval": "👍", "caring": "🤗", "confusion": "😵‍💫", "curiosity": "🔍",
    "desire": "🔥", "disappointment": "😞", "disapproval": "👎", "disgust": "🤢",
    "embarrassment": "😳", "excitement": "🤩", "fear": "😨", "gratitude": "🙏",
    "grief": "💔", "joy": "😊", "love": "💖", "nervousness": "😰",
    "optimism": "🌈", "pride": "🥹", "realization": "💡", "relief": "😌",
    "remorse": "😢", "sadness": "😔", "surprise": "😲", "neutral": "😐"
}

# Analyze dreams and compile processed output
processed = []
for text in dreams[:100]:  # Adjust this number if needed
    try:
        result = emotion_pipeline(text[:512])[0][0]
        label = result["label"].lower()
        emoji = EMOTION_EMOJIS.get(label, "🌙")
        processed.append({
            "dream": text.strip(),
            "emotion": label,
            "emoji": emoji
        })
    except Exception:
        processed.append({
            "dream": text.strip(),
            "emotion": "error",
            "emoji": "❓"
        })

# Save to JSON file
with open("data/processed_dreams.json", "w", encoding="utf-8") as f:
    json.dump(processed, f, indent=2)

print("✅ Done: processed_dreams.json has been saved.")
