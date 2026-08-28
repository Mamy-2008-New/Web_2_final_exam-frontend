const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@examen.com',
    password: 'admin123',
    role: 'ADMIN',
    active: true
  },
  {
    id: 2,
    email: 'etudiant1@examen.com',
    password: 'student123',
    role: 'STUDENT',
    active: true
  },
  {
    id: 3,
    email: 'etudiant2@examen.com',
    password: 'student123',
    role: 'STUDENT',
    active: true
  },
  {
    id: 4,
    email: 'etudiant.suspendu@examen.com',
    password: 'student123',
    role: 'STUDENT',
    active: false 
  }
];

export async function login(email, password) {
  const user = MOCK_USERS.find((u) => u.email === email);

  if (!user) {
    throw new Error('Identifiants invalides.');
  }

  if (!user.active) {
    throw new Error('Votre compte étudiant est suspendu.');
  }

  if (user.password !== password) {
    throw new Error('Identifiants invalides.');
  }

  const fakeToken = 'mock-jwt-token-12345';
  localStorage.setItem('token', fakeToken);
  localStorage.setItem('user', JSON.stringify({ id: user.id, email: user.email, role: user.role }));

  return { token: fakeToken, user };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}