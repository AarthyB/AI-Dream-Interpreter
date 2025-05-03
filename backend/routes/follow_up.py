from flask import Blueprint, request, jsonify
from utils.db import connect_db
from utils.auth import verify_token
from flask_cors import cross_origin


follow_up_blueprint = Blueprint("follow_up", __name__)

@follow_up_blueprint.route("/", methods=["POST"])

def submit_follow_ups():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    data = request.get_json()
    answers = data.get("answers", [])

    saved_followups = []  # collect the inserted follow-ups

    with connect_db() as conn:
        cursor = conn.cursor()
        for item in answers:
            question = item.get("question")
            answer = item.get("answer")
            if question and answer:
                cursor.execute("""
                    INSERT INTO follow_ups (user_id, question, answer)
                    VALUES (?, ?, ?)
                """, (user_id, question.strip(), answer.strip()))
                new_id = cursor.lastrowid  # capture the newly generated ID
                saved_followups.append({
                    "id": user_id,
                    "question": question.strip(),
                    "answer": answer.strip()
                })
        conn.commit()

    return jsonify({
        "status": "success",
        "saved_followups": saved_followups
    })


@follow_up_blueprint.route("/<int:followup_id>", methods=["PATCH"])
def update_followup(followup_id):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    data = request.get_json()
    new_answer = data.get("answer", "").strip()

    with connect_db() as conn:
        conn.execute(
            "UPDATE follow_ups SET answer = ? WHERE id = ? AND user_id = ?",
            (new_answer, followup_id, user_id)
        )
        conn.commit()

    return jsonify({"status": "updated"})


@follow_up_blueprint.route("/<int:followup_id>", methods=["DELETE"])
def delete_followup(followup_id):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    with connect_db() as conn:
        conn.execute("DELETE FROM follow_ups WHERE id = ? AND user_id = ?", (followup_id, user_id))
        conn.commit()

    return jsonify({"status": "deleted"})
