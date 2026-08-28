import { API_BASE_URL } from './config';

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erreur de connexion');
  }

  // Stocke le token et les infos utilisateur
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user || {}));
  }

  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}