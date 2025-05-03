from openai import OpenAI
import os
from utils.db import get_user_dreams
from utils.context import load_dream_context
from utils.emotion import analyze_emotion
from utils.logger import log_performance

import time
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def interpret_dream_with_questions(dream_text, user_id=None, history_snippet=""):
    context_samples = load_dream_context()

    dream_history = ""
    if user_id:
        past_dreams = get_user_dreams(user_id)[:3]
        if past_dreams:
            dream_history = "\n---\n".join([d["dream"] for d in past_dreams])

    history_block = f'\nBackground provided by the user:\n"{history_snippet}"' if history_snippet else ""
    dreams_block = f"\nRecent dreams by the user:\n{dream_history}" if dream_history else ""

    prompt = f"""
You are a compassionate AI dream therapist.

Below are public dream excerpts (for general reference only):
{context_samples}

---------------------

Now, analyze the user's dream using three psychological frameworks: Freudian, Jungian, and Cognitive. Write a single, rich interpretation with these perspectives in clear paragraphs.

After that, generate 2–3 thoughtful follow-up questions to help the user reflect on their experience. These questions should help uncover emotional nuances or patterns related to the dream.

User's Dream:
"{dream_text}"
{history_block}
{dreams_block}

Format your response like this:

🌌 Interpretation:
(3 paragraphs: Freudian, Jungian, Cognitive)

🧠 Follow-up Questions:
1.
2.
3.
"""

    try:
        start = time.time()

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{ "role": "user", "content": prompt }],
            max_tokens=750
        )
        end = time.time()
        content = response.choices[0].message.content.strip()
        log_performance("interpret", end - start, dream_text)

        # Split the content if follow-up questions are included
        if "🧠 Follow-up Questions:" in content:
            interpretation, questions = content.split("🧠 Follow-up Questions:", 1)
            return {
                "interpretation": interpretation.replace("🌌 Interpretation:", "").strip(),
                "questions": [q.strip("•1234567890. ") for q in questions.strip().split("\n") if q.strip()]
            }
        else:
            return {"interpretation": content.strip(), "questions": []}

    except Exception as e:
        return {
            "interpretation": f"Error during interpretation: {str(e)}",
            "questions": []
        }
