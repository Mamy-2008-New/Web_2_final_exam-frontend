import { USERS_MOCK } from '../../db/seed.js';

export const loginHandler = (req, res) => {
  const { email, password } = req.body;

  const user = USERS_MOCK.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  if (!user.active) {
    return res.status(403).json({ message: "Votre compte étudiant est suspendu." });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  return res.json({
    message: "Connexion réussie",
    token: "fake-jwt-token-for-testing",
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
};