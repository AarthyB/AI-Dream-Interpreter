import spacy
import re

try:
    nlp = spacy.load("en_core_web_sm")
except:
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_symbols(text):
    doc = nlp(text)
    symbols = set()

    # Named Entities (NER)
    for ent in doc.ents:
        if ent.label_ in {"PERSON", "ORG", "GPE", "LOC", "EVENT", "WORK_OF_ART", "PRODUCT", "NORP"}:
            symbols.add(ent.text.lower())

    # Fallback: noun chunks
    if not symbols:
        for chunk in doc.noun_chunks:
            cleaned = re.sub(r'[^a-zA-Z0-9 ]', '', chunk.text.strip().lower())
            if len(cleaned) > 2:
                symbols.add(cleaned)

    return list(symbols)
