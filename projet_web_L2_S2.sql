-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mariadb
-- Généré le : dim. 26 avr. 2026 à 21:27
-- Version du serveur : 12.2.2-MariaDB-ubu2404
-- Version de PHP : 8.3.30

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

-- --------------------------------------------------------

--
-- Structure de la table `activites`
--

CREATE TABLE `activites` (
  `prix` int(11) NOT NULL,
  `date_d` datetime NOT NULL,
  `date_f` datetime NOT NULL,
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `cap_act` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `lieu` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `activites`
--

INSERT INTO `activites` (`prix`, `date_d`, `date_f`, `id`, `nom`, `cap_act`, `description`, `lieu`) VALUES
(35, '2026-04-02 09:12:44', '2026-04-02 09:12:44', 47, 'AquaSplash', 0, NULL, NULL),
(25, '2026-04-14 00:00:00', '2026-04-14 00:00:00', 49, 'Barbecue', 25, '\"Partagez plus qu’un repas, partagez un moment !\"\r\n\r\nRejoignez-nous autour du grill pour l\'événement le plus chaleureux de la semaine ! Que vous soyez en famille ou entre amis, notre soirée barbecue est l\'occasion idéale de savourer de délicieuses grillades tout en profitant de l\'ambiance unique du camping.\r\n\r\nAu menu : Une sélection de viandes marinées, de brochettes de saison et d\'options végétariennes, le tout accompagné d\'un buffet de salades fraîches.\r\n\r\nL\'ambiance : Musique d\'ambiance, grandes tablées sous les étoiles et rires garantis.\r\n\r\nLe petit plus : Finissez la soirée en beauté autour du brasero pour griller quelques guimauves !', 'Arêches'),
(12, '2026-04-04 00:00:00', '2026-04-05 00:00:00', 54, 'Boire de l\'Eau', 12, NULL, NULL),
(1, '2026-04-01 00:00:00', '2026-04-26 00:00:00', 55, 'Activité TEst', 1, NULL, NULL),
(2, '2026-03-30 00:00:00', '2026-04-01 00:00:00', 56, 'jsp', 25, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `emplacements`
--

CREATE TABLE `emplacements` (
  `num_emplacement` int(11) NOT NULL,
  `capacite` int(11) NOT NULL,
  `prix` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `emplacements`
--

INSERT INTO `emplacements` (`num_emplacement`, `capacite`, `prix`, `nom`) VALUES
(1, 4, 45, 'Neptune'),
(2, 2, 30, 'Mars'),
(3, 6, 75, 'Pluton'),
(4, 4, 50, 'Uranus'),
(5, 8, 120, 'Terre'),
(6, 2, 35, 'Saturne'),
(7, 4, 45, 'Mercure'),
(8, 6, 80, 'Venus'),
(9, 2, 30, 'Jupiter'),
(10, 4, 55, 'Eris'),
(11, 4, 55, 'Ganymède'),
(12, 6, 90, 'Hauméa'),
(13, 8, 130, 'Cérès'),
(14, 2, 40, 'Makémaké'),
(15, 4, 60, 'Titan');

-- --------------------------------------------------------

--
-- Structure de la table `equipe_technique`
--

CREATE TABLE `equipe_technique` (
  `id_equipe_tech` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `access` int(11) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `equipe_technique`
--

INSERT INTO `equipe_technique` (`id_equipe_tech`, `nom`, `prenom`, `mail`, `password`, `access`) VALUES
(1, 'Gaborit', 'François', 'mailtest@gmail.com', '$2y$10$F3fJ/FNN/qkIT045OHMbpuo/VOwpOdeFUyBqaAGvMC/MXeMnEwgeK', 1);

-- --------------------------------------------------------

--
-- Structure de la table `familles`
--

CREATE TABLE `familles` (
  `id_famille` int(11) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `adresse` varchar(100) NOT NULL,
  `telephone` int(11) NOT NULL,
  `code_postal` int(11) NOT NULL,
  `id_payeur` int(11) DEFAULT NULL,
  `ville` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `familles`
--

INSERT INTO `familles` (`id_famille`, `mail`, `password`, `adresse`, `telephone`, `code_postal`, `id_payeur`, `ville`) VALUES
(66, 'maelgaborit1407@gmail.com', '$2y$10$F3fJ/FNN/qkIT045OHMbpuo/VOwpOdeFUyBqaAGvMC/MXeMnEwgeK', '260 route de Coutalon Areches', 768680116, 73270, 119, 'Areches'),
(67, 'teliogaborit@gmail.com', '$2y$10$W3mXBT1syk461evhwWHA8uJmTtotMm.8G6nLpI27L8GO6W.uXg7mO', '955 Rte de l\'École du Tremblay', 768680116, 73290, 122, 'LA MOTTE SERVOLEX'),
(69, 'telio@gmail.com', '$2y$10$ENhS7vlszs7Y0HV5nmwT/ONpHKH.yd/j5RgGmBDFTqbf/K0p5341W', '260 route de Coutalon Areches', 768680116, 73270, 122, 'Areches'),
(70, 'mail@mail.fr', '$2y$10$hGgVqcbJ187Me69EBN4xNObPU0a0u2yIsQN2JeNicSrO516Qn.pDm', '260 route du chemin', 7, 7270, 123, 'Areches'),
(72, 'mm1407@gmail.com', '$2y$10$pBKvp1Xogrh/X5EqmzKsNu8Amsn7WzzC6XcUNBIKkEzhMMjgvTb6K', 'Areches', 522, 73270, 125, ''),
(73, 'gaboritvincent@yahoo.fr', '$2y$10$s0kFGtVV6PtT8FxSd8kOKOvU.hW3rG3UCN9GhPHCz7YOZh4vs/MAm', 'Areches', 0, 73270, 126, '');

-- --------------------------------------------------------

--
-- Structure de la table `file_attente_activites`
--

CREATE TABLE `file_attente_activites` (
  `id_famille` int(11) NOT NULL,
  `id_activite` int(11) NOT NULL,
  `nb_membre` int(11) NOT NULL,
  `date_inscription` datetime NOT NULL,
  `id_attente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `file_attente_emplacements`
--

CREATE TABLE `file_attente_emplacements` (
  `id_famille` int(11) NOT NULL,
  `id_emplacement` int(11) NOT NULL,
  `date_debut` int(11) NOT NULL,
  `date_fin` int(11) NOT NULL,
  `id_fifo_emplacement` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservation_activites`
--

CREATE TABLE `reservation_activites` (
  `id_famille` int(11) NOT NULL,
  `id_activite` int(11) NOT NULL,
  `id_reservation_activite` int(11) NOT NULL,
  `nb_membre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservation_emplacement`
--

CREATE TABLE `reservation_emplacement` (
  `id_famille` int(11) NOT NULL,
  `num_emplacement` int(11) NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `id_res_empl` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reservation_emplacement`
--

INSERT INTO `reservation_emplacement` (`id_famille`, `num_emplacement`, `date_debut`, `date_fin`, `id_res_empl`) VALUES
(66, 1, '2026-04-10 00:00:00', '2026-04-19 00:00:00', 54);

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `date_naissance` date NOT NULL,
  `id_famille` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `date_naissance`, `id_famille`) VALUES
(119, 'Gaborit', 'Maël', '2006-07-14', 66),
(120, 'Gaborit', 'Telio', '2001-12-05', 67),
(122, 'Gaborit', 'Telio', '2026-04-03', 69),
(123, 'Gaborit', 'Greg', '2006-07-14', 70),
(125, 'Gaborit', 'Maël', '2026-03-31', 72),
(126, 'Gaborit', 'Vincent', '2026-04-16', 73);

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
-- Index pour la table `equipe_technique`
--
ALTER TABLE `equipe_technique`
  ADD PRIMARY KEY (`id_equipe_tech`);

--
-- Index pour la table `familles`
--
ALTER TABLE `familles`
  ADD PRIMARY KEY (`id_famille`),
  ADD KEY `FK_id_payeur` (`id_payeur`);

--
-- Index pour la table `file_attente_activites`
--
ALTER TABLE `file_attente_activites`
  ADD PRIMARY KEY (`id_attente`),
  ADD KEY `fk_id_fifo_famille` (`id_famille`),
  ADD KEY `fk_fifo_activite` (`id_activite`);

--
-- Index pour la table `file_attente_emplacements`
--
ALTER TABLE `file_attente_emplacements`
  ADD PRIMARY KEY (`id_fifo_emplacement`);

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
  ADD PRIMARY KEY (`id_res_empl`),
  ADD KEY `FK_Id_famille_res_emplacement` (`id_famille`),
  ADD KEY `FK_numEmplacement` (`num_emplacement`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT pour la table `equipe_technique`
--
ALTER TABLE `equipe_technique`
  MODIFY `id_equipe_tech` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `familles`
--
ALTER TABLE `familles`
  MODIFY `id_famille` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT pour la table `file_attente_activites`
--
ALTER TABLE `file_attente_activites`
  MODIFY `id_attente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT pour la table `file_attente_emplacements`
--
ALTER TABLE `file_attente_emplacements`
  MODIFY `id_fifo_emplacement` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reservation_activites`
--
ALTER TABLE `reservation_activites`
  MODIFY `id_reservation_activite` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- AUTO_INCREMENT pour la table `reservation_emplacement`
--
ALTER TABLE `reservation_emplacement`
  MODIFY `id_res_empl` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `familles`
--
ALTER TABLE `familles`
  ADD CONSTRAINT `FK_id_payeur` FOREIGN KEY (`id_payeur`) REFERENCES `utilisateurs` (`id`);

--
-- Contraintes pour la table `file_attente_activites`
--
ALTER TABLE `file_attente_activites`
  ADD CONSTRAINT `fk_fifo_activite` FOREIGN KEY (`id_activite`) REFERENCES `activites` (`id`),
  ADD CONSTRAINT `fk_id_fifo_famille` FOREIGN KEY (`id_famille`) REFERENCES `familles` (`id_famille`);

--
-- Contraintes pour la table `reservation_activites`
--
ALTER TABLE `reservation_activites`
  ADD CONSTRAINT `FK_ID_ACTIVITE` FOREIGN KEY (`id_activite`) REFERENCES `activites` (`id`),
  ADD CONSTRAINT `FK_famille_activite` FOREIGN KEY (`id_famille`) REFERENCES `familles` (`id_famille`);

--
-- Contraintes pour la table `reservation_emplacement`
--
ALTER TABLE `reservation_emplacement`
  ADD CONSTRAINT `FK_Id_famille_res_emplacement` FOREIGN KEY (`id_famille`) REFERENCES `familles` (`id_famille`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_numEmplacement` FOREIGN KEY (`num_emplacement`) REFERENCES `emplacements` (`num_emplacement`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD CONSTRAINT `fk_utilisateur_famille` FOREIGN KEY (`id_famille`) REFERENCES `familles` (`id_famille`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
