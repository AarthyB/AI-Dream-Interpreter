from flask import Blueprint, request, jsonify
from utils.auth import verify_token
from utils.db import connect_db

profile_blueprint = Blueprint("profile", __name__)

@profile_blueprint.route("/me", methods=["GET"])
def get_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.replace("Bearer ", "")
    user_id = verify_token(token)

    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    with connect_db() as conn:
        cursor = conn.execute(
            "SELECT display_name, theme, overlay, email FROM users WHERE id = ?",
            (user_id,)
        )
        row = cursor.fetchone()

    if not row:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "displayName": row["display_name"],
        "theme": row["theme"],
        "overlay": row["overlay"],
        "email": row["email"]
    })
