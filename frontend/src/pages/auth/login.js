import { USERS_MOCK } from './db/seed.js';

export const loginHandler = (req, res) => {
  const { email, password } = req.body;

  // 1. Recherche de l'utilisateur dans les fausses données
  const user = USERS_MOCK.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  // 2. Vérification de l'activation du compte (RG-11)
  if (!user.active) {
    return res.status(403).json({ message: "Votre compte étudiant est suspendu." });
  }

  // 3. Vérification du mot de passe
  if (user.password !== password) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  // 4. Réponse fructueuse (avec un faux token si JWT n'est pas configuré)
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