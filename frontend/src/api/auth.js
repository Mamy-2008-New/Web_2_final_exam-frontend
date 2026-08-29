import { API_BASE_URL } from './config';

function normalizeUser(user = {}) {
  if (!user || typeof user !== 'object') {
    return {};
  }

  return {
    ...user,
    role: String(user.role || '').toUpperCase(),
  };
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Identifiants invalides.');
  }

  const user = normalizeUser(data.user);
  const token = data.token;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return { token, user };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  try {
    return normalizeUser(JSON.parse(localStorage.getItem('user') || '{}'));
  } catch {
    localStorage.removeItem('user');
    return {};
  }
}