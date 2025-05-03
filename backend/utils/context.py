import json

def load_dream_context(path="backend/data/processed_dreams.json", limit=10):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        formatted = []
        for d in data[:limit]:
            dream = d.get("dream", "").strip()
            emotion = d.get("emotion", "unknown")
            emoji = d.get("emoji", "🌙")
            formatted.append(f"{emoji} [{emotion}] {dream}")

        return "\n---\n".join(formatted)

    except Exception as e:
        print("⚠️ Failed to load dream context:", str(e))
        return ""
