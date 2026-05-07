-- Script pour créer les comptes d'emplyé et admin afin de tester l'application en local//
-- À exécuter MANUELLEMENT dans Adminer / psql (base PostgreSQL locale ou autre)

-- Employé (rôle libele = 'employe')
INSERT INTO "user" (role_id, actif, email, password, nom, prenom, telephone, ville, pays, adresse_postals)
SELECT r.role_id,
       TRUE,
       'slimabida21@gmail.com',
       '$2b$10$DC6MXdDi6wNyEZWdZ1Ua5.lPK2Yd3C/addATt8il57IKy6jpU55ta',
       'Abida',
       'Slim',
       '0608654012',
       'Montrouge',
       'France',
       '30 rue Hippolyte Mulin'
FROM (SELECT role_id FROM role WHERE libele = 'employe' LIMIT 1) AS r
WHERE NOT EXISTS (
  SELECT 1 FROM "user" u WHERE u.email = 'slimabida21@gmail.com'
);

-- Administrateur (rôle libele = 'admin')
INSERT INTO "user" (role_id, actif, email, password, nom, prenom, telephone, ville, pays, adresse_postals)
SELECT r.role_id,
       TRUE,
       'jose@vitegourmand.fr',
       '$2b$10$i56Oya6dPAf8Lx329u2IDetoz41t/VvbUJAUj6qYuljQIOM8IlkDK',
       'Fernandez',
       'José',
       NULL,
       NULL,
       NULL,
       NULL
FROM (SELECT role_id FROM role WHERE libele = 'admin' LIMIT 1) AS r
WHERE NOT EXISTS (
  SELECT 1 FROM "user" u WHERE u.email = 'jose@vitegourmand.fr'
);


-- Role user utilisateur (rôle libele = 'utilisateur')
INSERT INTO "user" (role_id, actif, email, password, nom, prenom, telephone, ville, pays, adresse_postals)
SELECT r.role_id,
       TRUE,
       'abidaslim464@gmail.com',
       '$2b$10$6TAEdBcscjcxgEQeawxzQO6WPKPb1hrKxUMHzK1tNgp3tonVuefQ.',
       'Abida',
       'Slim',
       '0608654012',
       'Montrouge',
       'France',
       '30 rue Hippolyte Mulin'
FROM (SELECT role_id FROM role WHERE libele = 'utilisateur' LIMIT 1) AS r
WHERE NOT EXISTS (
  SELECT 1 FROM "user" u WHERE u.email = 'abidaslim464@gmail.com'
);

-- Recaler la séquence user_id après insertion (évite les conflits sur prochains INSERT)
SELECT setval(
  '"user_user_id_seq"',
  COALESCE((SELECT MAX(user_id) FROM "user"), 1),
  true
);
