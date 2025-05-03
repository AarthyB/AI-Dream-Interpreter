import os
import uuid
import requests
from flask import Blueprint, request, jsonify
from PIL import Image
from io import BytesIO
from utils.db import save_dream_image  # Optional: for saving to DB

image_bp = Blueprint("image", __name__)

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2"
HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}


def generate_image(prompt: str) -> str:
    payload = {"inputs": prompt}
    response = requests.post(HUGGINGFACE_API_URL, headers=HEADERS, json=payload, timeout=60)

    if response.status_code != 200:
        raise Exception(f"Image generation failed: {response.status_code}, {response.text}")

    image_bytes = response.content
    image = Image.open(BytesIO(image_bytes)).convert("RGB")

    # Save image locally
    image_id = str(uuid.uuid4())
    image_path = f"static/generated_images/{image_id}.png"
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    image.save(image_path, format="PNG")
    return "/" + image_path.replace("\\", "/")  # Return as relative URL
  

@image_bp.route("/", methods=["POST"])
def generate_image_endpoint():
    if not HUGGINGFACE_API_KEY:
        return jsonify({"error": "Missing Hugging Face API key"}), 500

    data = request.get_json()
    prompt = data.get("prompt")
    dream_id = data.get("dream_id")  # Optional

    if not prompt:
        return jsonify({"error": "Prompt is required."}), 400

    try:
        print(f"🔮 Generating image for: {prompt}")
        image_path = generate_image(prompt)
        
        if dream_id:
            save_dream_image(dream_id, image_path)

        return jsonify({
            "image_path": image_path,
            "message": "Image generated successfully!"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
