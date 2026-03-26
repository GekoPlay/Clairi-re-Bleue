-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : jeu. 26 mars 2026 à 09:36
-- Version du serveur : 8.0.45-0ubuntu0.24.04.1
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projet_web_L2_S2`
--
USE projet_web_L2_S2
-- --------------------------------------------------------

--
-- Structure de la table `activites`
--

CREATE TABLE `activites` (
  `prix` int NOT NULL,
  `date_d` datetime NOT NULL,
  `date_f` datetime NOT NULL,
  `id` int NOT NULL,
  `nom` varchar(50) NOT NULL,
  `cap_act` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `activites`
--

INSERT INTO `activites` (`prix`, `date_d`, `date_f`, `id`, `nom`, `cap_act`) VALUES
(35, '2026-03-11 11:41:02', '2026-03-11 11:41:02', 3, 'AquaSplash', 95),
(10, '2026-03-13 14:25:34', '2026-03-13 14:25:34', 4, 'Barbecue', 20);

-- --------------------------------------------------------

--
-- Structure de la table `emplacements`
--

CREATE TABLE `emplacements` (
  `num_emplacement` int NOT NULL,
  `capacite` int NOT NULL,
  `id_famille` int DEFAULT NULL,
  `prix` int NOT NULL,
  `status` int NOT NULL DEFAULT '0',
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `emplacements`
--

INSERT INTO `emplacements` (`num_emplacement`, `capacite`, `id_famille`, `prix`, `status`, `date_creation`) VALUES
(1, 4, NULL, 45, 0, '2000-01-01 00:00:00'),
(2, 2, NULL, 30, 2, '2026-03-15 12:58:07'),
(3, 6, NULL, 75, 2, '2000-01-01 00:00:00'),
(4, 4, NULL, 50, 0, '2026-03-15 12:58:07'),
(5, 8, NULL, 120, 0, '2026-03-15 12:58:07'),
(6, 2, NULL, 35, 0, '2000-01-01 00:00:00'),
(7, 4, NULL, 45, 0, '2026-03-15 12:58:07'),
(8, 6, NULL, 80, 0, '2026-03-15 12:58:07'),
(9, 2, NULL, 30, 0, '2026-03-15 12:58:07'),
(10, 4, NULL, 55, 0, '2026-03-15 12:58:07'),
(11, 4, NULL, 55, 0, '2026-03-15 12:58:07'),
(12, 6, NULL, 90, 0, '2026-03-15 12:58:07'),
(13, 8, NULL, 130, 0, '2026-03-15 12:58:07'),
(14, 2, NULL, 40, 0, '2026-03-15 12:58:07'),
(15, 4, NULL, 60, 0, '2026-03-15 12:58:07');

-- --------------------------------------------------------

--
-- Structure de la table `equipe_membre`
--

CREATE TABLE `equipe_membre` (
  `id` int NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `mail` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` int NOT NULL DEFAULT '3'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `equipe_membre`
--

INSERT INTO `equipe_membre` (`id`, `nom`, `prenom`, `mail`, `password`, `role`) VALUES
(1, 'Gaborit', 'François', 'mailtest@gmail.com', '123', 1);

-- --------------------------------------------------------

--
-- Structure de la table `familles`
--

CREATE TABLE `familles` (
  `id_famille` int NOT NULL,
  `mail` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `adresse` varchar(100) NOT NULL,
  `telephone` int NOT NULL,
  `code_postal` int NOT NULL,
  `id_payeur` int NOT NULL,
  `ville` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `familles`
--

INSERT INTO `familles` (`id_famille`, `mail`, `password`, `adresse`, `telephone`, `code_postal`, `id_payeur`, `ville`) VALUES
(51, 'maelgaborit1407@gmail.com', '$2y$10$/Ug68ovoucuCUf4yBL8Di.9.PLFhqXnPv46n97Qj1Kr88Els/0F9e', '260 route de Coutalon Areches', 768680116, 73270, 96, 'Areches'),
(52, 'teliogaborit1407@gmail.com', '$2y$10$6tboc1YGNbfawb089Bjz2OA/v9O0pgfIUqfFcPPZS30KqPsdZ8Lem', '260 route de Coutalon Areches', 768680116, 73270, 105, 'Areches'),
(53, 'julian@mail.fr', '$2b$10$OJSdX4tYaF.MJUtj5YVm0e4KkD2QLQ8yAKGI7BYV4xahjqEyv6gw6', '260 route de Coutalon Areches', 768680116, 73270, 106, 'Areches');

-- --------------------------------------------------------

--
-- Structure de la table `reservation_activites`
--

CREATE TABLE `reservation_activites` (
  `id_famille` int NOT NULL,
  `id_activite` int NOT NULL,
  `id_reservation_activite` int NOT NULL,
  `nb_membre` int NOT NULL,
  `status` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reservation_activites`
--

INSERT INTO `reservation_activites` (`id_famille`, `id_activite`, `id_reservation_activite`, `nb_membre`, `status`) VALUES
(51, 4, 56, 8, 1),
(51, 3, 92, 5, 1);

-- --------------------------------------------------------

--
-- Structure de la table `reservation_emplacement`
--

CREATE TABLE `reservation_emplacement` (
  `id_famille` int NOT NULL,
  `num_emplacement` int NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `status` int NOT NULL,
  `id_res_empl` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reservation_emplacement`
--

INSERT INTO `reservation_emplacement` (`id_famille`, `num_emplacement`, `date_debut`, `date_fin`, `status`, `id_res_empl`) VALUES
(51, 1, '2026-03-15 12:58:07', '2026-03-17 12:58:07', 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `date_naissance` date NOT NULL,
  `id_famille` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `date_naissance`, `id_famille`) VALUES
(96, 'Gaborit', 'Maël', '2006-07-14', 51),
(97, 'Gaborit', 'telio', '2026-03-10', 51),
(106, 'Gaborit', 'Julian', '2026-03-11', 53);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activites`
--
ALTER TABLE `activites`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `emplacements`
--
ALTER TABLE `emplacements`
  ADD PRIMARY KEY (`num_emplacement`);

--
-- Index pour la table `equipe_membre`
--
ALTER TABLE `equipe_membre`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `familles`
--
ALTER TABLE `familles`
  ADD PRIMARY KEY (`id_famille`),
  ADD KEY `FK_id_payeur` (`id_payeur`);

--
-- Index pour la table `reservation_activites`
--
ALTER TABLE `reservation_activites`
  ADD PRIMARY KEY (`id_reservation_activite`),
  ADD KEY `FK_ID_ACTIVITE` (`id_activite`),
  ADD KEY `FK_famille_activite` (`id_famille`);

--
-- Index pour la table `reservation_emplacement`
--
ALTER TABLE `reservation_emplacement`
  ADD PRIMARY KEY (`id_res_empl`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Id_famille` (`id_famille`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activites`
--
ALTER TABLE `activites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `equipe_membre`
--
ALTER TABLE `equipe_membre`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `familles`
--
ALTER TABLE `familles`
  MODIFY `id_famille` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT pour la table `reservation_activites`
--
ALTER TABLE `reservation_activites`
  MODIFY `id_reservation_activite` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT pour la table `reservation_emplacement`
--
ALTER TABLE `reservation_emplacement`
  MODIFY `id_res_empl` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reservation_activites`
--
ALTER TABLE `reservation_activites`
  ADD CONSTRAINT `FK_famille_activite` FOREIGN KEY (`id_famille`) REFERENCES `familles` (`id_famille`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_ID_ACTIVITE` FOREIGN KEY (`id_activite`) REFERENCES `activites` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Contraintes pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD CONSTRAINT `FK_Id_famille` FOREIGN KEY (`id_famille`) REFERENCES `familles` (`id_famille`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
