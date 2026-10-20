# 🏛️ ASEP 2ΓΒ/2026 — Data Intelligence & Analytics Hub

> An interactive, high-performance data exploration platform and AI Assistant built on top of public examination results from the Greek Panhellenic Competition **ASEP 2ΓΒ/2026** (51,900+ candidates, 10,500+ appointees, 52 specialties).

🔗 **Live Platform:** [asepanalytics.app](https://asepanalytics.app) *(https://asepanalytics.app)*

---

## 🌟 Key Features

- **Interactive Geolocation Map:** Visualizing public sector job openings across all 13 Greek administrative regions using GeoJSON and choropleth-style density filtering.
- **Deep Candidate Analytics:** Granular breakdown by specialty, preferences, ranking, degree levels (MSc/PhD), and territorial quotas.
- **Autonomous AI Assistant:** Powered by Groq LLMs with zero-latency tool-calling against static data chunks (candidate lookups, qualification matching, ranking diagnostics).
- **Zero-Database Architecture:** Optimized static JSON chunking with client-side indexing, enabling lightning-fast loads on serverless edge networks (Vercel).
- **GDPR-Conscious Data Masking:** Fully compliant presentation preserving candidate anonymity (masked identity numbers).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **Styling & Motion:** Tailwind CSS, Framer Motion
- **Visualizations:** Recharts, `react-simple-maps` (GeoJSON)
- **AI & LLM:** Groq SDK (`openai/gpt-oss-120b`) with multi-key cooldown & dynamic function calling
- **Data Engineering:** Python (Pandas, OpenPyXL) ETL pipeline processing 54+ heterogeneous Excel sheets into normalized JSON indexes

---

## 👤 Project Concept & Implementation

**Created by [Fokion](https://www.linkedin.com/in/fokionas/)**  
*A non-IT professional leveraging modern data engineering, interactive UI paradigms, and LLM orchestration to transform complex public records into actionable intelligence.*

Feel free to connect on [LinkedIn](https://www.linkedin.com/in/fokionas/)!