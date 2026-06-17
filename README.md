# 🧠 SentimentIQ — AI-Powered Sentiment Analysis Platform

> Live Demo: **[sentiqai.edgeone.app](https://sentiqai.edgeone.app)**

A fully browser-based **NLP Sentiment Analysis** platform that classifies text as Positive, Negative, or Neutral — with 8-emotion detection, keyword highlighting, batch analysis, and interactive dashboards.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Sentiment Classification** | Positive / Negative / Neutral with compound score |
| 😊 **8-Emotion Detection** | Joy, Anger, Fear, Sadness, Surprise, Disgust, Trust, Anticipation |
| 📦 **Batch Analysis** | Analyze up to 50 texts at once with distribution charts |
| 🛒 **Amazon Reviews** | 20 pre-loaded product reviews dataset |
| 🐦 **Social Media** | 20 Twitter/Instagram posts dataset |
| 📰 **News Articles** | 20 headlines dataset |
| 📊 **Trend Charts** | Sentiment over time (7d / 30d / 90d) |
| 🗺️ **Topic Heatmap** | Multi-source sentiment comparison by topic |
| 💡 **Business Insights** | Marketing, pain points & positive driver analysis |
| 🎨 **Dark Mode UI** | Glassmorphism design with smooth animations |

---

## 🚀 How It Works

The NLP engine runs **100% in the browser** — no server, no API calls.

### Algorithm
1. **Tokenization** — Text is split into lowercase tokens with contraction handling
2. **Lexicon Lookup** — 300+ word sentiment lexicon with morphological variant matching
3. **Booster Handling** — Words like *"very"*, *"extremely"* multiply the next word's score
4. **Negation Detection** — 3-word window flips polarity (e.g. *"not good"* → negative)
5. **VADER Normalization** — `compound = sum / √(sum² + 15)` maps to [-1, +1]
6. **Classification** — `≥ +0.05` → Positive | `≤ -0.05` → Negative | else → Neutral

### Emotion Detection
Uses **Plutchik's Wheel of Emotions** (8 primary emotions) with word-list matching and frequency-based scoring.

---

## 📁 Project Structure

```
sentiqai/
├── index.html      # App shell & UI layout
├── style.css       # Design system (dark theme, glassmorphism)
├── nlp.js          # NLP engine: lexicon, scoring, emotion detection
├── data.js         # Sample datasets (Amazon, Social, News) + trend data
├── charts.js       # Chart.js rendering module
└── app.js          # Main app controller & navigation
```

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **Vanilla CSS** — Custom dark design system, animations, glassmorphism
- **Vanilla JavaScript** — Zero dependencies NLP engine
- **Chart.js** — Interactive data visualizations (CDN)
- **Google Fonts** — Inter & JetBrains Mono

---

## 🏃 Run Locally

No build step needed — just open the file:

```bash
git clone https://github.com/YOUR_USERNAME/sentiqai.git
cd sentiqai
# Open index.html in your browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

---

## 📊 Use Cases

- **Marketing** — Understand customer sentiment from reviews
- **Product Development** — Surface pain points and feature requests
- **Social Listening** — Track public opinion trends
- **News Monitoring** — Detect reputational risks early
- **Research** — Analyze large text datasets quickly

---

## 📄 License

MIT © 2024 — Free to use and modify.

---

<div align="center">
  <strong>Built with ❤️ | Deployed on <a href="https://edgeone.ai">EdgeOne</a></strong>
</div>
