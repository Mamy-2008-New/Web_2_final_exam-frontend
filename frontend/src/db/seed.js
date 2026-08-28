// src/db/seed.js (Données de test en mémoire)

export const USERS_MOCK = [
  {
    id: 1,
    email: 'admin@examen.com',
    password: 'admin123', // En texte clair pour tester sans DB
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
    active: false // Compte désactivé (RG-11)
  }
];

export const EXAMS_MOCK = [
  {
    id: 1,
    name: 'Examen Final Web 2',
    course_name: 'Développement Web',
    start_date: '2026-01-01T00:00:00Z',
    end_date: '2026-12-31T23:59:59Z'
  }
];