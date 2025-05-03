from flask import Blueprint, request, jsonify
from utils.db import connect_db
from utils.auth import verify_token
from collections import Counter

emotions_blueprint = Blueprint("emotions", __name__)

@emotions_blueprint.route("/", methods=["GET"])
def get_emotion_summary():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    with connect_db() as conn:
        cursor = conn.execute("SELECT emotion FROM dreams WHERE user_id = ?", (user_id,))
        emotions = [row["emotion"] for row in cursor.fetchall()]

    counts = Counter(emotions)
    return jsonify(counts)
