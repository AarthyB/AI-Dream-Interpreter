import sqlite3

def connect_db():
    conn = sqlite3.connect("dreams.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with connect_db() as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS dreams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            dream TEXT,
            interpretation TEXT,
            mood TEXT,
            emotion TEXT,
            source TEXT DEFAULT 'user',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS life_history (
            user_id TEXT PRIMARY KEY,
            history TEXT
        )
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            score INTEGER,
            notes TEXT,
            interpretation TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS follow_ups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            question TEXT,
            answer TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()

def save_dream(user_id, dream_text, interpretation, mood, emotion_label, emoji):
    with connect_db() as conn:
        conn.execute("""
            INSERT INTO dreams (user_id, dream, interpretation, mood, emotion, emoji, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        """, (user_id, dream_text, interpretation, mood, emotion_label, emoji))
        conn.commit()


def get_user_dreams(user_id):
    with connect_db() as conn:
        cursor = conn.execute("SELECT * FROM dreams WHERE user_id = ? ORDER BY timestamp DESC", (user_id,))
        return [dict(row) for row in cursor.fetchall()]

def save_life_story(user_id, history):
    with connect_db() as conn:
        conn.execute("REPLACE INTO life_history (user_id, history) VALUES (?, ?)", (user_id, history))
        conn.commit()

def get_life_story(user_id):
    with connect_db() as conn:
        cursor = conn.execute("SELECT history FROM life_history WHERE user_id = ?", (user_id,))
        row = cursor.fetchone()
        return row["history"] if row else ""

def get_follow_ups(user_id):
    with connect_db() as conn:
        cursor = conn.execute(
            "SELECT question, answer, id, timestamp FROM follow_ups WHERE user_id = ? ORDER BY timestamp DESC",
            (user_id,)
        )
        return [dict(row) for row in cursor.fetchall()]



def create_user_if_not_exists(user_id, email):
    with connect_db() as conn:
        cursor = conn.execute("SELECT id FROM users WHERE id = ?", (user_id,))
        if cursor.fetchone() is None:
            conn.execute("""
                INSERT INTO users (id, email, display_name, theme, overlay)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, email, '', 'deepnight', 'particles'))
            conn.commit()
