# Audit du frontend

## Corrections effectuées

- `ProtectedRoute` utilise maintenant `children` et `allowedRole`, ce qui correspond aux routes déclarées dans `App.jsx`.
- Les rôles des routes utilisent `ADMIN` et `STUDENT`, comme dans les données d'authentification.
- Correction de l'import de `USERS_MOCK` dans `src/pages/auth/login.js`.
- Remplacement de `fetchWithAuth`, qui n'existait pas dans `src/api/client.js`, par `client`.
- Correction du lien de retour de `AdminExamResults` : `/admin/exams` n'était pas déclaré comme route.

## Points à vérifier avec le backend

- `AdminCourses` et `AdminExamResults` utilisent l'API `http://localhost:3000`. Un backend compatible doit être lancé sur ce port.
- Une partie des données est encore en mock/local state : les ajouts d'étudiants, examens et certaines données historiques ne sont pas persistants.
- `src/pages/auth/login.js` ressemble à un handler Express backend et n'est pas utilisé par le frontend React. Il serait plus propre de le placer dans le projet backend.
- `ExamCorrection` dépend de `location.state` pour afficher la correction détaillée ; un rechargement direct peut donc perdre cet état.
- `StudentHistory` affiche actuellement des données statiques.

## Vérification

Les imports locaux ont été vérifiés et les erreurs évidentes de routage/import ont été corrigées. Le build Vite de l'archive originale n'a pas pu être validé jusqu'au bout : les dépendances natives de `rolldown` présentes dans `node_modules` étaient incomplètes.
