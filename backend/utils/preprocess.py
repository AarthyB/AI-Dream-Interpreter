import re
import spacy

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def clean_dream(text):
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text).strip()    # Normalize whitespace
    return text.lower()

def preprocess_dream(text):
    cleaned = clean_dream(text)
    doc = nlp(cleaned)
    lemmatized = [token.lemma_ for token in doc if not token.is_stop and token.is_alpha]
    return {
        "cleaned": cleaned,
        "lemmatized": lemmatized,
        "tokens": [token.text for token in doc]
    }
