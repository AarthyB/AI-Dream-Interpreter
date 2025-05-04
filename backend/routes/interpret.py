from flask import Blueprint, request, jsonify
from utils.gpt import interpret_dream_with_questions
from utils.db import save_dream
from utils.emotion import analyze_emotion
from utils.auth import verify_token
from flask_cors import cross_origin
from utils.db import connect_db


interpret_blueprint = Blueprint("interpret", __name__)

@interpret_blueprint.route("/", methods=["POST"])
@cross_origin(origins=["https://dream-frontend-fiuw.onrender.com", "http://localhost:4200"], supports_credentials=True)

def interpret():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    data = request.get_json()
    dream_text = data.get("dream")
    mood = data.get("mood", "").strip() 
    life_story = data.get("lifeStory", "")

    result = interpret_dream_with_questions(dream_text, user_id, life_story)
    interpretation = result["interpretation"]
    questions = result["questions"]

    emotion, emoji = analyze_emotion(dream_text)

    save_dream(user_id, dream_text, interpretation, mood, emotion, emoji)

    return jsonify({
            "interpretation": interpretation,
            "questions": questions,
            "emotion": emotion,
            "emoji": emoji
    })

