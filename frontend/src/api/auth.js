export async function login(email, password) {
const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});

const data = await response.json();
if (!response.ok) throw new Error(data.message);

localStorage.setItem('token', data.token);
return data;
}