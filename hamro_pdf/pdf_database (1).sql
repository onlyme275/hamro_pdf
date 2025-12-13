-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 04, 2025 at 09:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pdf_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `signatures`
--

CREATE TABLE `signatures` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `signature_name` varchar(255) NOT NULL,
  `signature_type` enum('draw','text','image') NOT NULL,
  `signature_data` text NOT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `signatures`
--

INSERT INTO `signatures` (`id`, `user_id`, `signature_name`, `signature_type`, `signature_data`, `width`, `height`, `is_default`, `created_at`, `updated_at`) VALUES
('45d37cfc-11d6-46b3-a0e7-f186330fcf19', '42be885e-d886-4e2a-8f5a-356a4c522468', 'Demo Signature', 'draw', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 300, 100, 1, '2025-09-27 09:29:13', '2025-09-27 09:29:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `image` varchar(500) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `google_id` varchar(255) DEFAULT NULL,
  `auth_provider` enum('local','google','facebook') DEFAULT 'local',
  `email_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `image`, `phone`, `address`, `active`, `created_at`, `updated_at`, `google_id`, `auth_provider`, `email_verified`) VALUES
('42be885e-d886-4e2a-8f5a-356a4c522468', 'Super Admin', 'admin@superadmin.com', '$2b$10$2b2c8anTeGLKufZlpJt1RuaZ6kP9JblDioxctS0XhWYB5C8oHziE6', 'admin', NULL, NULL, NULL, 1, '2025-08-26 12:44:33', '2025-09-30 05:30:22', NULL, 'local', 1),
('b81fe416-9704-4eb9-82a8-3a247e2fceb2', 'Sunab Baskota', 'sunabbaskota@gmail.com', '$2b$10$9fcDfFGHHQTciTJBP6/LFeQDQ2sow9yQS109BrZ8Qt.MrjIFntaci', 'user', NULL, NULL, NULL, 1, '2025-08-27 22:43:56', '2025-09-30 05:15:11', '114468385331197065520', 'google', 1),
('ba5a7a70-75c5-4f1d-a8c2-945b582b1f2c', 'Test User', 'test@gmail.com', '$2b$10$9JMacu6UQTT/YG9MjOKBue7Do36V23x4shFGnsUMOTlyHWsZKfxXe', 'premium', NULL, NULL, NULL, 1, '2025-08-26 12:45:54', '2025-09-30 05:30:50', NULL, 'local', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `signatures`
--
ALTER TABLE `signatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_user_default` (`user_id`,`is_default`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD KEY `idx_users_active` (`active`),
  ADD KEY `idx_users_role` (`role`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
