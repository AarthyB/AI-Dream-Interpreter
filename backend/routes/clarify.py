from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
import time
from utils.logger import log_performance

clarify_bp = Blueprint("clarify", __name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@clarify_bp.route("/", methods=["POST"])
def clarify():
    data = request.get_json()
    dream = data.get("dream")

    prompt = """You are a dream clarifier. If the dream is vague, confusing, or missing details, "
        "ask 1-2 clarification questions. If it's clear and understandable, reply with:\n"
        "\"The dream is clear. No clarification needed.\""""

    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": f'Dream: "{dream}"'}
    ]
    
    start = time.time()
    response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=750
        )

    content = response.choices[0].message.content.strip()
    end = time.time()
    log_performance("clarify", end - start, dream)

    if "No clarification" in content or "The dream is clear" in content:
        return jsonify({ "clarified": dream, "questions": [] })

    questions = [line.lstrip("-•0123456789. ").strip() for line in content.split("\n") if line.strip()]
    return jsonify({"clarified": dream, "questions": questions})