// auth.js — user authentication via localStorage

const Auth = (() => {
  const USERS_KEY = 'resumeiq_users';
  const SESSION_KEY = 'resumeiq_session';

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function register(name, email, password) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const user = {
      id: 'u_' + Date.now(),
      name,
      email,
      password, // plain text — fine for a demo/local app
      created_at: new Date().toISOString(),
      role: email === 'admin@resumeiq.com' ? 'admin' : 'user'
    };
    users.push(user);
    saveUsers(users);
    return { ok: true, user };
  }

  function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    const session = { userId: user.id, email: user.email, name: user.name, role: user.role };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, user };
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = '../index.html';
  }

  function getSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function requireAuth(redirectTo = '../pages/login.html') {
    if (!getSession()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  function requireGuest(redirectTo = '../pages/dashboard.html') {
    if (getSession()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  function getUserById(id) {
    return getUsers().find(u => u.id === id) || null;
  }

  function getAllUsers() {
    return getUsers().map(u => ({ ...u, password: undefined }));
  }

  function deleteUser(id) {
    const users = getUsers().filter(u => u.id !== id);
    saveUsers(users);
  }

  // seed admin if first run
  function init() {
    const users = getUsers();
    if (!users.find(u => u.email === 'admin@resumeiq.com')) {
      register('Admin', 'admin@resumeiq.com', 'changeme');
    }
  }

  init();

  return { register, login, logout, getSession, requireAuth, requireGuest, getUserById, getAllUsers, deleteUser };
})();
