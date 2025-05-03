from openai import OpenAI
# emotion_pipeline = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)

import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Emotion → Emoji Map
EMOTION_EMOJIS = {
    "Curiosity": "🧐",
    "Wonder": "🌟",
    "Fear": "😨",
    "Joy": "😊",
    "Sadness": "😢",
    "Grief": "😭",
    "Anger": "😠",
    "Pain": "😔",
    "Love": "😍",
    "Blush": "🥰",
    "Disgust":"🤢",
    "Nostalgia": "🕰️",
    "Longing": "💭",
    "Concern": "😟",
    "Awe": "🤩",
    "Discovery": "🔍",
    "Weirdness": "🌀",
    "Peace": "🕊️",
    "Reflection": "🪞",
    "Anxiety": "😰"
}

def analyze_emotion(dream_text: str) -> (str):
    print("Using OpenAI key:", os.getenv("OPENAI_API_KEY")
)

    """
    Analyze dream emotional tone using OpenAI GPT
    Returns (emotion, emoji)
    """
    prompt = f"""
You are an expert dream analyst.
Given the following dream, classify the primary emotional tone into one of these:
[Curiosity, Wonder, Fear, Joy, Sadness, Grief, Anger, Pain, Love, Blush, Disgust, Nostalgia, Longing, Concern, Awe, Discovery, Weirdness, Peace, Reflection, Anxiety].

Dream: \"{dream_text}\"

Respond with ONLY the emotion word. No extra words.
    """

    try:
        print("Using OpenAI key:", os.getenv("OPENAI_API_KEY"))

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{ "role": "user", "content": prompt }],
            max_tokens=750
        )
        emotion = response.choices[0].message.content.strip()

        # Pick emoji
        emoji = EMOTION_EMOJIS.get(emotion, "🌙")  # Default to moon if unknown
        return emotion, emoji
    except Exception as e:
        print(f"Error detecting emotion: {e}")
        return "Neutral", "🌙"  # fallback
