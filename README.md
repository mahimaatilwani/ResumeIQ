# ResumeIQ — ATS Resume Analyzer

> Analyze. Improve. Get Interview Ready.

A fully client-side ATS resume analyzer built with vanilla HTML, CSS, and JavaScript. No backend required.

---

## 🚀 Quick Start

### Option 1 — Local server (recommended)

**With Node.js:**
```bash
npx serve .
# Open http://localhost:3000
```

**With Python:**
```bash
python -m http.server 8080
# Open http://localhost:8080
```

### Option 2 — GitHub Pages (free hosting)

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Source → main → / (root)**
3. Access at `https://yourusername.github.io/repo-name`

---

## 🔑 Default Admin Account

```

```

---

## 🤖 AI Suggestions (optional)

To enable Claude AI-powered resume tips:
1. Get a free API key at https://console.anthropic.com
2. Sign in → Profile → Paste your key → Save

Without a key, rule-based suggestions still work perfectly.

---

## 📁 Project Structure

```
resumeiq/
├── index.html          # Landing page
├── css/
│   └── style.css       # All styles
├── js/
│   ├── auth.js         # Auth (localStorage)
│   ├── resume.js       # Resume & report storage
│   ├── analyzer.js     # ATS scoring engine + Claude API
│   └── utils.js        # UI helpers (toasts, charts, etc.)
└── pages/
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── upload.html
    ├── report.html
    └── profile.html
```

---

## ✨ Features

- ATS score out of 100 across 8 criteria
- Section detection (Contact, Education, Experience, Skills, Projects, Certifications, Achievements)
- Keyword analysis (40+ tech skills, 14 soft skills)
- Radar chart visualization (Chart.js)
- AI-powered suggestions via Claude API
- Resume history & report tracking
- Admin account with user overview
- 100% browser-based — no server, no database

---

## 🛠 Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Chart.js (radar chart)
- localStorage / sessionStorage (data persistence)
- Anthropic Claude API (optional AI suggestions)
