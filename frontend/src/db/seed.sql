-- Nettoyage préalable si besoin
TRUNCATE users RESTART IDENTITY CASCADE;

-- 1. Compte Administrateur (RG-01)
-- Mot de passe clair : admin123
INSERT INTO users (email, password, role, active) 
VALUES (
    'admin@examen.com', 
    '$2b$10$wT.Lg2fA1L6L1u9W8J2y4u2K1UaPZgUuM8xQ7rJk6L2xW4mP0yvK2', 
    'ADMIN', 
    TRUE
);

-- 2. Compte Étudiant Actif 1
-- Mot de passe clair : student123
INSERT INTO users (email, password, role, active) 
VALUES (
    'etudiant1@examen.com', 
    '$2b$10$zE4vO2dF2/7yR/4I4JzN5.P6K4LzZ1234567890abcdefghijklm', 
    'STUDENT', 
    TRUE
);

-- 3. Compte Étudiant Actif 2
-- Mot de passe clair : student123
INSERT INTO users (email, password, role, active) 
VALUES (
    'etudiant2@examen.com', 
    '$2b$10$zE4vO2dF2/7yR/4I4JzN5.P6K4LzZ1234567890abcdefghijklm', 
    'STUDENT', 
    TRUE
);

-- 4. Compte Étudiant Suspendu / Désactivé (Pour tester le refus explicite RG-11)
-- Mot de passe clair : student123
INSERT INTO users (email, password, role, active) 
VALUES (
    'etudiant.suspendu@examen.com', 
    '$2b$10$zE4vO2dF2/7yR/4I4JzN5.P6K4LzZ1234567890abcdefghijklm', 
    'STUDENT', 
    FALSE
);