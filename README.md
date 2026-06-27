# ResumeIQ — ATS Resume Analyzer

> ⚠️ This is a portfolio/demo project built for learning purposes. Data is stored in browser localStorage only — not a real database.

**Live Demo:** [mahimaatilwani.github.io/ResumeIQ](https://mahimaatilwani.github.io/ResumeIQ)

---

## About

ResumeIQ is a client-side ATS (Applicant Tracking System) resume analyzer. Upload your resume and instantly get a score out of 100, section-by-section feedback, keyword analysis, and improvement suggestions.

---

## Features

- ATS score out of 100 across 8 criteria
- Section detection — Contact, Education, Experience, Skills, Projects, Certifications, Achievements
- Keyword analysis — 40+ technical skills, 14+ soft skills
- Radar chart visualization
- AI-powered suggestions via Claude API (optional)
- Resume history and report tracking
- Admin panel with user and resume management
- 100% browser-based — no server or database required

---

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- Chart.js for data visualization
- Anthropic Claude API (optional, for AI suggestions)
- localStorage for data persistence
- GitHub Pages for hosting

---

## How to Run Locally

```bash
# Using Node.js
npx serve .

# Using Python
python -m http.server 8080
```

Then open `http://localhost:3000` in your browser.

---

## Project Structure

```
ResumeIQ/
├── index.html         # Landing page
├── css/
│   └── style.css      # All styles
├── js/
│   ├── auth.js        # Authentication
│   ├── resume.js      # Resume storage
│   ├── analyzer.js    # ATS scoring engine
│   └── utils.js       # UI helpers
└── pages/
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── upload.html
    ├── report.html
    ├── profile.html
    └── admin.html
```

---

## Built By

Mahima Atilwani — [GitHub](https://github.com/mahimaatilwani)
