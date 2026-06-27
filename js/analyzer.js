// analyzer.js — ATS scoring engine + Claude API for AI suggestions

const Analyzer = (() => {

  // ── keyword lists ──────────────────────────────────────────────
  const TECH_KEYWORDS = [
    'python','java','javascript','typescript','c++','c#','sql','html','css',
    'react','angular','vue','node','express','django','flask','spring',
    'aws','azure','gcp','docker','kubernetes','git','github','gitlab',
    'mongodb','mysql','postgresql','redis','elasticsearch',
    'machine learning','deep learning','tensorflow','pytorch','nlp',
    'rest','graphql','api','microservices','agile','scrum','devops','ci/cd',
    'linux','bash','terraform','ansible','jenkins','selenium'
  ];

  const SOFT_KEYWORDS = [
    'leadership','communication','teamwork','collaboration','problem solving',
    'critical thinking','adaptability','time management','project management',
    'analytical','creativity','attention to detail','organization','mentoring'
  ];

  const SECTION_PATTERNS = {
    contact:      /(?:email|phone|linkedin|github|address|contact|@[\w.]+\.(com|in|io|org))/i,
    education:    /\b(education|academic|university|college|degree|bachelor|master|b\.?tech|m\.?tech|b\.?e\.|mba|phd|school|institute)\b/i,
    experience:   /\b(experience|work history|employment|internship|intern|worked at|job|career)\b/i,
    skills:       /\b(skills|technical skills|technologies|tools|competencies|expertise|proficiencies)\b/i,
    projects:     /\b(projects|personal projects|academic projects|portfolio|built|developed)\b/i,
    certifications: /\b(certifications?|certificates?|certified|credential|license|accreditation)\b/i,
    achievements: /\b(achievements?|awards?|honors?|recognition|accomplishments?|accolades?)\b/i,
  };

  // ── section detection ──────────────────────────────────────────
  function detectSections(text) {
    const lower = text.toLowerCase();
    const found = {};
    for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
      found[key] = pattern.test(lower);
    }
    return found;
  }

  // ── keyword detection ──────────────────────────────────────────
  function detectKeywords(text) {
    const lower = text.toLowerCase();
    const foundTech = TECH_KEYWORDS.filter(kw => lower.includes(kw));
    const foundSoft = SOFT_KEYWORDS.filter(kw => lower.includes(kw));
    return { tech: foundTech, soft: foundSoft, all: [...foundTech, ...foundSoft] };
  }

  // ── contact detail check ───────────────────────────────────────
  function checkContact(text) {
    const hasEmail    = /@[\w.-]+\.\w{2,}/.test(text);
    const hasPhone    = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}/.test(text);
    const hasLinkedIn = /linkedin\.com\/in\//i.test(text);
    const hasGitHub   = /github\.com\//i.test(text);
    return { hasEmail, hasPhone, hasLinkedIn, hasGitHub };
  }

  // ── scoring ────────────────────────────────────────────────────
  function score(text) {
    const sections  = detectSections(text);
    const keywords  = detectKeywords(text);
    const contact   = checkContact(text);

    // Contact (10 pts)
    let contactScore = 0;
    if (contact.hasEmail)    contactScore += 4;
    if (contact.hasPhone)    contactScore += 3;
    if (contact.hasLinkedIn) contactScore += 2;
    if (contact.hasGitHub)   contactScore += 1;

    // Education (10 pts)
    const educationScore = sections.education ? 10 : 0;

    // Skills (20 pts)
    const techCount = keywords.tech.length;
    const skillScore = Math.min(20, Math.round((techCount / 8) * 20));

    // Experience (15 pts)
    const experienceScore = sections.experience ? 15 : 0;

    // Projects (15 pts)
    const projectScore = sections.projects ? 15 : 0;

    // Certifications (10 pts)
    const certScore = sections.certifications ? 10 : 0;

    // Keywords (10 pts)
    const kwCount = keywords.all.length;
    const keywordScore = Math.min(10, Math.round((kwCount / 10) * 10));

    // Formatting (10 pts) — heuristic based on length & structure
    const wordCount = text.split(/\s+/).length;
    let formatScore = 0;
    if (wordCount > 150)  formatScore += 3;
    if (wordCount > 300)  formatScore += 3;
    if (wordCount < 1200) formatScore += 2; // not too long
    if (/\d{4}/.test(text)) formatScore += 2; // has years

    const overall = contactScore + educationScore + skillScore + experienceScore +
                    projectScore + certScore + keywordScore + formatScore;

    return {
      overall: Math.min(100, overall),
      breakdown: {
        contact:        { score: contactScore,    max: 10 },
        education:      { score: educationScore,  max: 10 },
        skills:         { score: skillScore,      max: 20 },
        experience:     { score: experienceScore, max: 15 },
        projects:       { score: projectScore,    max: 15 },
        certifications: { score: certScore,       max: 10 },
        keywords:       { score: keywordScore,    max: 10 },
        formatting:     { score: formatScore,     max: 10 },
      },
      sections,
      keywords,
      contact,
    };
  }

  // ── rule-based suggestions (fast, offline) ────────────────────
  function ruleSuggestions(result) {
    const s = [];
    const { sections, keywords, contact, breakdown } = result;

    if (!contact.hasEmail)     s.push('Add your email address to the contact section.');
    if (!contact.hasPhone)     s.push('Include a phone number so recruiters can reach you.');
    if (!contact.hasLinkedIn)  s.push('Add your LinkedIn profile URL (linkedin.com/in/yourname).');
    if (!contact.hasGitHub)    s.push('Add your GitHub profile URL to showcase your code.');
    if (!sections.education)   s.push('Add an Education section with your degree, institution, and graduation year.');
    if (!sections.experience)  s.push('Include a Work Experience section with job titles, companies, and dates.');
    if (!sections.projects)    s.push('Add 2–3 technical projects with description, tools used, and impact.');
    if (!sections.certifications) s.push('Consider adding relevant certifications (AWS, Google, Microsoft, etc.).');
    if (!sections.achievements)s.push('Highlight achievements or awards to stand out from other candidates.');
    if (keywords.tech.length < 5) s.push(`Expand your skills section — only ${keywords.tech.length} technical keyword(s) detected. Aim for 8–12.`);
    if (keywords.soft.length < 2) s.push('Add soft skills like leadership, communication, and teamwork.');
    if (breakdown.formatting.score < 6) s.push('Use clear section headings and consistent date formatting (e.g., Jan 2023 – Mar 2024).');

    return s;
  }

  // ── Claude AI suggestions ──────────────────────────────────────
  async function aiSuggestions(resumeText, scoreResult) {
    const prompt = `You are an expert ATS resume coach. Analyze this resume and provide 5–7 highly specific, actionable improvement tips.

RESUME TEXT:
"""
${resumeText.slice(0, 3000)}
"""

ATS SCORE: ${scoreResult.overall}/100

DETECTED SECTIONS: ${Object.entries(scoreResult.sections).filter(([,v])=>v).map(([k])=>k).join(', ')}
MISSING SECTIONS: ${Object.entries(scoreResult.sections).filter(([,v])=>!v).map(([k])=>k).join(', ') || 'none'}
TECH SKILLS FOUND: ${scoreResult.keywords.tech.slice(0,10).join(', ') || 'none'}

Respond ONLY with a JSON array of suggestion strings. Example:
["Suggestion 1 here.", "Suggestion 2 here."]

Be specific to THIS resume. No preamble, no markdown, just the JSON array.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': Config.getApiKey(), 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    const text = data.content[0].text.trim();
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }

  return { score, detectSections, detectKeywords, checkContact, ruleSuggestions, aiSuggestions };
})();

// ── Config — API key storage ───────────────────────────────────
const Config = (() => {
  const KEY = 'resumeiq_api_key';
  function getApiKey() { return localStorage.getItem(KEY) || ''; }
  function setApiKey(k) { localStorage.setItem(KEY, k); }
  function hasApiKey() { return !!getApiKey(); }
  return { getApiKey, setApiKey, hasApiKey };
})();
