from flask import Blueprint, request, jsonify
import csv
from datetime import datetime
import os

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/", methods=["POST"])
def feedback():
    data = request.get_json()
    dream = data.get("dream")
    rating = data.get("rating")

    # ✅ Ensure logs directory exists
    os.makedirs("logs", exist_ok=True)

    with open("logs/user_feedback.csv", "a", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([datetime.now().isoformat(), dream[:100], rating])

    return jsonify({"status": "received"})

