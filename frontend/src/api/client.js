export async function fetchWithAuth(url, options = {}) {
const token = localStorage.getItem('token');
const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
};

const response = await fetch(`http://localhost:3000${url}`, { ...options, headers });
const data = await response.json();

if (!response.ok) {
    throw new Error(data.message);
}
return data;
}