from flask import Flask
from flask_cors import CORS

from routes.interpret import interpret_blueprint
from routes.symbols import symbols_blueprint
from routes.life_story import life_story_blueprint
from routes.emotions import emotions_blueprint
from routes.follow_up import follow_up_blueprint
from routes.history import history_blueprint
from routes.profile import profile_blueprint
from routes.user_settings import user_settings_blueprint
from routes.clarify import clarify_bp
from routes.feedback import feedback_bp


app = Flask(__name__)


# ✅ Strict CORS config for Angular
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}},
     supports_credentials=True,
     expose_headers=["Authorization"],
     allow_headers=["Content-Type", "Authorization"])


# ✅ Register routes
app.register_blueprint(interpret_blueprint, url_prefix="/api/interpret")
app.register_blueprint(symbols_blueprint, url_prefix="/api/symbols")
app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
app.register_blueprint(life_story_blueprint, url_prefix="/api/life-story")
app.register_blueprint(clarify_bp, url_prefix="/api/clarify")

app.register_blueprint(emotions_blueprint, url_prefix="/api/emotions")
app.register_blueprint(follow_up_blueprint, url_prefix="/api/follow-up")
app.register_blueprint(history_blueprint, url_prefix="/api/history")
app.register_blueprint(profile_blueprint, url_prefix="/api")
app.register_blueprint(user_settings_blueprint, url_prefix="/api")

@app.route("/")
def home():
    return "Dream Interpreter API is running!"

if __name__ == "__main__":
    app.run(debug=True)
