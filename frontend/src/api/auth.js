import { client } from './client';

export async function login(email, password) {
  // Backend contract: POST /api/auth/login -> { token, user: { id, name, email, role } }
  // role is lowercase: "admin" | "student" (see backend/src/models/User.ts)
  const data = await client('/api/auth/login', {
    body: { email, password },
  });

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

/** Rehydrates the session from the backend (e.g. on page reload) via GET /api/auth/me. */
export async function fetchCurrentUser() {
  const user = await client('/api/auth/me');
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}
