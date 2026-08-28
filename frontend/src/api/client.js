import { API_BASE_URL } from './config';

export async function client(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem('token');

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    // Accept either a plain object or an already-stringified body.
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Session expired or invalid — clear it and bounce to login.
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  // 204 No Content has no body to parse.
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue');
  }

  return data;
}

export default client;
