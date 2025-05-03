from utils.db import connect_db
from utils.emotion import analyze_emotion

def reanalyze_all_dreams():
    with connect_db() as conn:
        dreams = conn.execute("SELECT id, dream FROM dreams").fetchall()

        for d in dreams:
            dream_text = d["dream"]
            new_emotion, new_emoji = analyze_emotion(dream_text)
            conn.execute("""
                UPDATE dreams
                SET emotion = ?, emoji = ?
                WHERE id = ?
            """, (new_emotion, new_emoji, d["id"]))
        conn.commit()

if __name__ == "__main__":
    reanalyze_all_dreams()
    print("✅ All dreams reprocessed successfully!")
