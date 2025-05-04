import spacy
from flask import Blueprint, jsonify, request
from utils.db import connect_db
from utils.auth import verify_token
import en_core_web_sm

symbols_blueprint = Blueprint("symbols", __name__)


try:
    nlp = en_core_web_sm.load()
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

FORBIDDEN_POS = {"PRON", "DET", "AUX", "ADP"}

@symbols_blueprint.route("/", methods=["GET"])
def get_symbols():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid token"}), 403

    symbols_counter = {}

    with connect_db() as conn:
        cursor = conn.execute("SELECT dream FROM dreams WHERE user_id = ?", (user_id,))
        dreams = cursor.fetchall()

    for dream in dreams:
        doc = nlp(dream["dream"])
        for token in doc:
            if token.pos_ == "NOUN" and token.pos_ not in FORBIDDEN_POS and len(token.text) > 2:
                word = token.lemma_.lower()
                symbols_counter[word] = symbols_counter.get(word, 0) + 1

    sorted_symbols = sorted(symbols_counter.items(), key=lambda x: x[1], reverse=True)[:10]

    return jsonify(sorted_symbols)
