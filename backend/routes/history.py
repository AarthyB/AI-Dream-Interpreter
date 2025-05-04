from flask import Blueprint, request, jsonify
from utils.db import connect_db, get_follow_ups
from utils.auth import verify_token
from utils.emotion import analyze_emotion
from flask_cors import cross_origin


history_blueprint = Blueprint("history", __name__)

@history_blueprint.route("/", methods=["GET"])
def get_history():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    with connect_db() as conn:
        cursor = conn.execute("""
                SELECT id, dream, interpretation, mood, emotion, emoji, timestamp
                FROM dreams
                WHERE user_id = ?
                ORDER BY timestamp DESC
            """, (user_id,))
        dreams = [dict(row) for row in cursor.fetchall()]


    followups = get_follow_ups(user_id)

    return jsonify({
        "dreams": dreams,
        "followups": followups
    })


@history_blueprint.route("/<int:dream_id>", methods=["PATCH"])
# @cross_origin(origins=["https://dream-frontend-fiuw.onrender.com","http://localhost:4200"], supports_credentials=True)
def edit_dream(dream_id):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    data = request.get_json()
    new_dream = data.get("dream", "").strip()
    new_interpretation = data.get("interpretation", "").strip()

    with connect_db() as conn:
        conn.execute(
            "UPDATE dreams SET dream = ?, interpretation = ? WHERE id = ? AND user_id = ?",
            (new_dream, new_interpretation, dream_id, user_id)
        )
        conn.commit()

    return jsonify({"status": "updated"})


@history_blueprint.route("/<int:dream_id>", methods=["DELETE"])
def delete_dream(dream_id):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    with connect_db() as conn:
        conn.execute("DELETE FROM dreams WHERE id = ? AND user_id = ?", (dream_id, user_id))
        conn.commit()

    return jsonify({"status": "deleted"})
