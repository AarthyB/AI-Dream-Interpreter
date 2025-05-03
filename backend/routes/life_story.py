from flask import Blueprint, request, jsonify
from utils.db import save_life_story, get_life_story
from utils.auth import verify_token

life_story_blueprint = Blueprint("life_story", __name__)

@life_story_blueprint.route("/", methods=["POST"])
def submit_life_story():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    data = request.get_json()
    story = data.get("story", "").strip()

    # if story:
    save_life_story(user_id, story)
    return jsonify({"status": "success"})
    # else:
    #     return jsonify({"error": "Empty story"}), 400

@life_story_blueprint.route("/", methods=["GET"])
def get_life_story_route():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    story = get_life_story(user_id)
    return jsonify({"story": story or ""})
