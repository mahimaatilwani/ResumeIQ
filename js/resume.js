// resume.js — resume & report storage via localStorage

const ResumeDB = (() => {
  const RESUMES_KEY = 'resumeiq_resumes';
  const REPORTS_KEY = 'resumeiq_reports';

  function getResumes() {
    return JSON.parse(localStorage.getItem(RESUMES_KEY) || '[]');
  }

  function getReports() {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
  }

  function saveResumes(list) {
    localStorage.setItem(RESUMES_KEY, JSON.stringify(list));
  }

  function saveReports(list) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(list));
  }

  function addResume(userId, name, textContent) {
    const resumes = getResumes();
    const resume = {
      resume_id: 'r_' + Date.now(),
      user_id: userId,
      resume_name: name,
      text_content: textContent,
      upload_date: new Date().toISOString(),
      ats_score: null
    };
    resumes.push(resume);
    saveResumes(resumes);
    return resume;
  }

  function updateResumeScore(resumeId, score) {
    const resumes = getResumes();
    const idx = resumes.findIndex(r => r.resume_id === resumeId);
    if (idx !== -1) {
      resumes[idx].ats_score = score;
      saveResumes(resumes);
    }
  }

  function addReport(report) {
    const reports = getReports();
    const existing = reports.findIndex(r => r.resume_id === report.resume_id);
    if (existing !== -1) reports.splice(existing, 1);
    reports.push({ ...report, report_id: 'rp_' + Date.now() });
    saveReports(reports);
  }

  function getResumesByUser(userId) {
    return getResumes()
      .filter(r => r.user_id === userId)
      .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
  }

  function getResumeById(id) {
    return getResumes().find(r => r.resume_id === id) || null;
  }

  function getReportByResumeId(resumeId) {
    return getReports().find(r => r.resume_id === resumeId) || null;
  }

  function deleteResume(resumeId) {
    saveResumes(getResumes().filter(r => r.resume_id !== resumeId));
    saveReports(getReports().filter(r => r.resume_id !== resumeId));
  }

  function getAllResumes() {
    return getResumes().sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
  }

  function getAllReports() {
    return getReports();
  }

  return {
    addResume, updateResumeScore, addReport,
    getResumesByUser, getResumeById, getReportByResumeId,
    deleteResume, getAllResumes, getAllReports
  };
})();
