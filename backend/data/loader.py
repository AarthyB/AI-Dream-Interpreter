import json
import csv
from utils.preprocess import preprocess_dream

def load_kaggle_csv(path):
    dreams = []
    with open(path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            text = row.get("Dream", row.get("dream"))
            if text and len(text) > 30:
                dreams.append(preprocess_dream(text))
    return dreams

def load_reddit_json(path):
    dreams = []
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
        for post in data:
            text = post.get("body") or post.get("title") or ""
            if len(text) > 30:
                dreams.append(preprocess_dream(text))
    return dreams

# Example:
kaggle_dreams = load_kaggle_csv("data/kaggle_dreams.csv")
reddit_dreams = load_reddit_json("data/reddit_dreams.json")
