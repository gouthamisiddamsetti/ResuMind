<div align="center">

# 🧠 ResuMind

### Intelligent AI-Powered Resume Analyzer, ATS Scorer & Career Optimizer

[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests Passing](https://img.shields.io/badge/Tests-20%2F20%20Passing-10b981.svg)](test/)
[![Zero External Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Node.js)-6366f1.svg)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gouthamisiddamsetti/ResuMind/pulls)

**ResuMind** is a full-featured, lightning-fast platform designed to help job seekers crack the Applicant Tracking System (ATS) barrier, uncover keyword gaps, quantify impact, and land more technical interviews.

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Documentation](#-api-endpoints) • [ATS Scoring Guide](#-ats-scoring-algorithm)

</div>

---

## ⚡ Why ResuMind?

Over 75% of resumes are discarded by Applicant Tracking Systems before a human recruiter ever sees them. Common pitfalls include:
- **Missing critical keywords and taxonomy synonyms** required by the job posting.
- **Vague, passive bullet points** lacking action verbs (*"worked on"*, *"assisted with"*).
- **Zero measurable outcomes** (missing quantifiable metrics, percentages, throughput).
- **Unparseable structures** and complex non-standard layouts.

**ResuMind solves this** with an intelligent multi-dimensional scoring engine, a STAR-framework bullet point rewriter, an ATS resume builder with real-time preview, and an application pipeline tracker.

---

## 🚀 Key Features

### 1. 📊 Multi-Dimensional ATS Resume Audit
- **Weighted Compatibility Score (0–100%)**: Instant visual speed gauge and tier classification (*Excellent*, *Competitive*, *Needs Optimization*, *At Risk*).
- **4-Pillar Evaluation**:
  1. **🎯 Keywords & Skills Match (40%)**: Hard skills, tools, cloud, databases, and methodologies.
  2. **⚡ Action Verbs Strength (20%)**: Proactive leadership and technical verbs vs. passive phrasing.
  3. **📈 Quantifiable Results & Metrics (20%)**: Detects percentages, latency improvements, team scale, and dollar values.
  4. **📋 Format & Structure (20%)**: Detects contact info, sections, word count, and ATS red flags.
- **Interactive Keyword Gap Explorer**: Filter by *Matched*, *Missing Critical*, *Missing Recommended*, and *Resume Bonus Skills*.
- **Prioritized Action Plan**: Ranked step-by-step checklist to increase ATS score.

### 2. ✨ AI Bullet Point Rewriter (STAR Framework)
- Transforms weak bullet points into 3 distinct high-impact variations:
  - **Technical & Scale Focus**: Emphasizes architecture, concurrency, and reliability.
  - **Metrics & Performance Focus**: Emphasizes latency reduction, revenue, and KPI gains.
  - **Leadership & Execution Focus**: Emphasizes cross-functional delivery and team velocity.
- 1-Click **Copy to Clipboard** for fast resume editing.

### 3. 📝 Interactive ATS Resume Builder
- Form-based intuitive editor covering contact information, summary, experience, skills, and education.
- **Live Real-Time ATS Preview** with three switchable compliant templates:
  - *Modern Clean*
  - *Executive Classic*
  - *Tech Minimalist*
- **1-Click Print / PDF Export**: Margin-perfect `@media print` CSS formatted for 1-2 page ATS submissions.
- **JSON Data Export**: Full resume portability.

### 4. 💼 Job Application & Pipeline Tracker
- Track applications across stages: `Saved`, `Applied`, `Interviewing`, `Offer`, `Rejected`.
- Real-time pipeline metrics: Total Applications, Interview Conversion Rate %, Offers count.
- Store company notes, salary expectations, and match history.

### 5. ⚡ 1-Click Demo Pre-Loads
- Test the application instantly with curated sample profiles:
  - **Alex Rivera**: Senior Full Stack Engineer (~88% match against Stripe).
  - **Jordan Chen**: AI & Machine Learning Engineer (~85% match against Frontier AI Lab).
  - **Taylor Morgan**: Junior Developer (~58% baseline match).

---

## 🏗️ Architecture

ResuMind is engineered with **zero external production dependencies**, running purely on native Node.js and modern browser APIs:

```
ResuMind/
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore patterns
├── LICENSE                   # MIT License
├── package.json              # Project scripts & metadata
├── README.md                 # Project documentation
├── server.js                 # Native Node.js HTTP server & REST router
├── src/
│   ├── analyzer/
│   │   ├── atsEngine.js          # Master 4-pillar weighted scoring engine
│   │   ├── keywordExtractor.js   # Skill taxonomy, alias normalizer & gap analyzer
│   │   ├── actionVerbs.js        # Action verb taxonomy & weak phrasing detector
│   │   ├── metricsDetector.js    # Regex metric patterns & impact ratio evaluator
│   │   └── sectionParser.js      # ATS resume structure parser & contact extractor
│   ├── ai/
│   │   ├── bulletOptimizer.js    # STAR-method bullet generator (3 variations)
│   │   ├── summaryGenerator.js   # Tailored 3-sentence professional summary synthesis
│   │   └── llmClient.js          # Optional LLM integration hook (Gemini / OpenAI)
│   ├── storage/
│   │   └── dataStore.js          # Persistent JSON datastore for applications & history
│   └── samples/
│       └── sampleData.js         # Curated realistic resumes & job postings
├── public/
│   ├── index.html            # Single Page Application layout & tab views
│   ├── css/
│   │   └── style.css         # Modern design system, dark/light theme & print stylesheet
│   └── js/
│       ├── app.js                # Core controller, theme & toast notifications
│       ├── analyzerView.js       # ATS scoring UI & interactive SVG gauge
│       ├── bulletOptimizerView.js# Bullet rewriter & copy-to-clipboard controller
│       ├── resumeBuilderView.js  # Live builder & PDF export handler
│       └── trackerView.js        # Application Kanban board controller
├── test/
│   ├── atsEngine.test.js         # Master scoring algorithm unit tests
│   ├── keywordExtractor.test.js  # Skill gap & alias unit tests
│   ├── actionVerbs.test.js       # Action verb detector unit tests
│   ├── metricsDetector.test.js   # Quantifiable metrics unit tests
│   ├── bulletOptimizer.test.js   # STAR bullet rewriter unit tests
│   └── server.test.js            # REST API integration tests
└── data/
    └── .gitkeep              # Auto-persisted data directory
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher.
- **npm**: v8.0.0 or higher.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gouthamisiddamsetti/ResuMind.git
   cd ResuMind
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open the application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Development Mode
Run with auto-reloading enabled:
```bash
npm run dev
```

### Running Tests
Execute the comprehensive automated test suite (20 unit & integration tests):
```bash
npm test
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and uptime |
| `POST` | `/api/analyze` | Benchmark resume text against job description |
| `POST` | `/api/optimize-bullet` | Generate 3 STAR-format bullet variations |
| `POST` | `/api/generate-summary` | Generate tailored 3-sentence professional summary |
| `GET` | `/api/applications` | List all tracked job applications & conversion stats |
| `POST` | `/api/applications` | Save a new job application |
| `PUT` | `/api/applications/:id` | Update application stage (`Applied`, `Interviewing`, etc.) |
| `DELETE` | `/api/applications/:id` | Delete tracked application |
| `GET` | `/api/samples` | Retrieve pre-loaded sample resumes & job postings |

### Sample Analysis Request
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Jane Doe\njane@example.com\n- Spearheaded microservices using Node.js and AWS with 99.9% uptime.",
    "jobDescription": "Looking for a Senior Software Engineer with Node.js, AWS, and Docker experience."
  }'
```

---

## 📐 ATS Scoring Algorithm

ResuMind's formula computes a composite score:

$$\text{ATS Score} = 0.40 \cdot K + 0.20 \cdot V + 0.20 \cdot M + 0.20 \cdot F$$

Where:
- **K (Keywords Match %)**: Percentage of required technologies, frameworks, and methodologies detected in the resume, with extra weight for high-frequency critical requirements.
- **V (Action Verbs %)**: Proportion of bullet points initiating with past-tense power verbs (e.g., *Architected*, *Engineered*, *Spearheaded*) minus penalties for passive phrasing (*worked on*, *assisted*).
- **M (Quantifiable Metrics %)**: Proportion of bullet points demonstrating measurable outcomes (percentages, currency, throughput, team scale).
- **F (Format & Structure %)**: Compliance across contact information, section recognizability, optimal length (400–900 words), and machine readability.

### Score Tiers
- **85 – 100 (Excellent)**: High likelihood of bypassing automated filters.
- **70 – 84 (Competitive)**: Solid baseline; minor keyword/metric additions will elevate ranking.
- **50 – 69 (Needs Optimization)**: Partial match; critical skills or quantifiable impact missing.
- **< 50 (At Risk)**: Likely to be screened out; overhaul required.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

<div align="center">
  <sub>Developed by <a href="https://github.com/gouthamisiddamsetti">Gouthami Siddamsetti</a></sub>
</div>

<!-- commit 1: 2026-11-06T05:47:34.665Z -->
<!-- commit 2: 2026-11-06T05:47:35.192Z -->
<!-- commit 3: 2026-11-06T05:47:35.612Z -->
<!-- commit 4: 2026-11-06T05:47:36.019Z -->
<!-- commit 5: 2026-11-06T05:47:36.396Z -->
<!-- commit 6: 2026-11-06T05:47:36.796Z -->
<!-- commit 7: 2026-11-06T05:47:37.208Z -->
<!-- commit 8: 2026-11-06T05:47:37.607Z -->
<!-- commit 9: 2026-11-06T05:47:38.010Z -->
<!-- commit 10: 2026-11-06T05:47:38.387Z -->
<!-- commit 11: 2026-11-06T05:47:38.781Z -->
<!-- commit 12: 2026-11-06T05:47:39.152Z -->
<!-- commit 13: 2026-11-06T05:47:39.563Z -->