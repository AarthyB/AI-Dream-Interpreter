from flask import Blueprint, request, jsonify
from utils.auth import verify_token
from utils.db import connect_db

user_settings_blueprint = Blueprint("user_settings", __name__)

@user_settings_blueprint.route("/user/", methods=["PATCH"])
def update_user_settings():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.replace("Bearer ", "")
    user_id = verify_token(token)

    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    data = request.get_json()
    display_name = data.get("displayName", "").strip()
    theme = data.get("theme", "").strip()
    overlay = data.get("overlay", "").strip()

    with connect_db() as conn:
        conn.execute("""
            UPDATE users
            SET display_name = ?, theme = ?, overlay = ?
            WHERE id = ?
        """, (display_name, theme, overlay, user_id))
        conn.commit()

    return jsonify({"status": "updated"})
