import spacy
import re
import en_core_web_sm

try:
    nlp = en_core_web_sm.load()
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_symbols(text):
    doc = nlp(text)
    symbols = set()

    # Named Entities (NER)
    for ent in doc.ents:
        if ent.label_ in {"PERSON", "ORG", "GPE", "LOC", "EVENT", "WORK_OF_ART", "PRODUCT", "NORP"}:
            symbols.add(ent.text.lower())

    if not symbols:
        for chunk in doc.noun_chunks:
            cleaned = re.sub(r'[^a-zA-Z0-9 ]', '', chunk.text.strip().lower())
            if len(cleaned) > 2:
                symbols.add(cleaned)

    return list(symbols)
