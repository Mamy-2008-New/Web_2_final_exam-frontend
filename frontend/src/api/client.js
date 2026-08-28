import { API_BASE_URL } from './config';

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // RG-13: Gestion propre des erreurs JSON du serveur (400, 401, 403, 404, 409)
    throw new Error(data.message || `Erreur ${response.status}`);
  }

  return data;
}