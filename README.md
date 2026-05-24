<div align="center">

# 🌙 AI Dream Interpreter

**A Generative AI-powered dream analysis app grounded in Freudian, Jungian, and Cognitive psychology**

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![OpenAI](https://img.shields.io/badge/OpenAI_GPT--4o--mini-412991?style=flat&logo=openai&logoColor=white)](https://openai.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)

🔗 **[Live Demo on Render](https://dream-frontend-fiuw.onrender.com)**

</div>

---

## 📖 About

AI Dream Interpreter bridges classical psychological theory with modern machine intelligence. Unlike static dictionary-based tools that map symbols like "water = emotions", this app generates **empathetic, personalized interpretations** that evolve with your dream history and life context.

---

## ✨ Features

| Module | Description |
|---|---|
| 🗒️ **Journal** | Submit dreams; a Clarifier Agent resolves ambiguity before the Interpreter responds |
| 🧠 **Interpreter** | GPT-4o-mini generates Freudian, Jungian & Cognitive interpretations with 27-category emotion labels |
| 🔍 **Symbol Detection** | SpaCy NER + regex identifies and explains recurring dream symbols |
| 📖 **Life Story** | Add personal context (traumas, aspirations) to get more personalized interpretations |
| 🕓 **History** | Browse, edit, or delete past dreams and their interpretations |
| 📊 **Insights** | Emotion pie chart + symbol bar graph to track patterns over time |
| ⚙️ **Settings** | Switch between dream themes and symbol overlay styles |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Angular Frontend               │
│   Journal · History · Insights · Settings  │
└──────────────────┬──────────────────────────┘
                   │ HTTP (REST)
┌──────────────────▼──────────────────────────┐
│              Flask Backend                  │
│                                             │
│   ┌─────────────┐     ┌─────────────────┐  │
│   │  Clarifier  │────▶│   Interpreter   │  │
│   │    Agent    │     │     Agent       │  │
│   └─────────────┘     └────────┬────────┘  │
│                                │           │
│   ┌──────────────┐   ┌─────────▼────────┐  │
│   │  SpaCy NER   │   │  GPT-4o-mini     │  │
│   │  (Symbols)   │   │  (OpenAI API)    │  │
│   └──────────────┘   └──────────────────┘  │
│                                             │
│   SQLite (dreams)   Firebase (auth/JWT)     │
└─────────────────────────────────────────────┘
```

---

## 📊 Performance

| Metric | Result |
|---|---|
| Clarifier Agent Response Time | ~1.1 seconds |
| Interpreter Agent Response Time | ~8.0 seconds |
| Emotion Classification Accuracy | ~95% |
| Symbol Tagging Precision | ~95% |
| Frontend Tab Transition Latency | ~200ms |
| User Satisfaction (6 respondents) | 100% rated 5/5 ⭐ |

---

## 🛠️ Tech Stack

**Frontend:** Angular · TypeScript  
**Backend:** Python · Flask  
**AI / NLP:** OpenAI GPT-4o-mini · SpaCy NER (`en_core_web_sm`)  
**Auth & Storage:** Firebase (JWT) · SQLite  
**DevOps:** Docker · Render  

---

## 🚀 Getting Started

### Prerequisites

- Node.js & Angular CLI
- Python 3.9+
- An OpenAI API key
- A Firebase project with credentials JSON

### Environment Variables

Create a `.env` file in the **backend** folder (or export these in your shell):

```bash
OPENAI_API_KEY=your_openai_api_key_here
FIREBASE_CREDENTIALS=path/to/your/firebase_credentials.json
```

### Run Locally

You'll need **two terminals** running simultaneously.

**Terminal 1 — Frontend**

```bash
cd frontend
npm install
ng serve
```

App will be available at `http://localhost:4200`

**Terminal 2 — Backend**

```bash
cd backend
pip install -r requirements.txt
python app.py
```

API will be available at `http://localhost:5000`

---

## 🌐 Live Demo

The app is deployed on Render (free tier — may take ~30s to wake up on first load):

👉 **[https://dream-frontend-fiuw.onrender.com](https://dream-frontend-fiuw.onrender.com)**

---

## 📚 References

- Kaggle Dream Dataset — [sarikakv1221/dreams](https://www.kaggle.com/datasets/sarikakv1221/dreams)
- Reddit r/Dreams — [reddit.com/r/Dreams](https://www.reddit.com/r/Dreams/)
- GoEmotions (27-category emotion labels) — [arXiv:2005.00547](https://arxiv.org/abs/2005.00547)
- OpenAI GPT API — [platform.openai.com/docs](https://platform.openai.com/docs/)
- Angular Docs — [angular.io/docs](https://angular.io/docs)

---

<div align="center">
  <i>Built with 🌙 and a lot of curiosity about the subconscious mind</i>
</div>
