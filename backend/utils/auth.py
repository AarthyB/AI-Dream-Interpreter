import firebase_admin
from firebase_admin import credentials, auth
import os
from utils.db import create_user_if_not_exists 
import json


import os, json
from firebase_admin import credentials, initialize_app

firebase_key_str = os.environ.get("FIREBASE_CREDENTIALS")

if firebase_key_str:
    # Render: decode the environment variable
    cred = credentials.Certificate(json.loads(firebase_key_str))
else:
    # Local: load from local JSON file
    cred = credentials.Certificate("firebase_key.json")

initialize_app(cred)


def verify_token(token):
    try:
        decoded = auth.verify_id_token(token)
        user_id = decoded["uid"]
        email = decoded.get("email", "")

        # 🛠️ After decoding token, create user if not exists
        create_user_if_not_exists(user_id, email)

        return user_id
    except:
        print("Token verification failed")
        return None
