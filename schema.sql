-- MySQL schema for Mensa-App
-- Contains table definitions required by the API endpoints.

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `meal_name` VARCHAR(255) NOT NULL,
  `pickup_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `menus` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `student_price` DECIMAL(5,2) NOT NULL,
  `teacher_price` DECIMAL(5,2) NOT NULL,
  `day` ENUM('montag','dienstag','mittwoch','donnerstag','freitag') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default menus so they can be managed like normal entries
INSERT INTO `menus` (`title`, `image`, `student_price`, `teacher_price`, `day`) VALUES
('H\xE4hnchen-Gem\xFCsepfanne mit Reis', '/reis_haehnchen_pfanne_2.jpg', 10.00, 12.00, 'montag'),
('Spaghetti mit Hackfleisch-Tomatensauce', '/202_spaghetti-bolognese.jpg', 10.00, 12.00, 'montag'),
('Gem\xFCse-Lasagne mit Spinat und Ricotta', '/Download.jpg', 10.00, 12.00, 'montag'),
('Rindergeschnetzeltes mit Reis', '/reis_haehnchen_pfanne_2.jpg', 10.00, 12.00, 'dienstag'),
('Penne Arrabiata', '/202_spaghetti-bolognese.jpg', 10.00, 12.00, 'dienstag'),
('Gem\xFCse-Curry', '/Download.jpg', 10.00, 12.00, 'dienstag'),
('Fischst\xE4bchen mit Kartoffelsalat', '/reis_haehnchen_pfanne_2.jpg', 10.00, 12.00, 'mittwoch'),
('K\xE4sesp\xE4tzle', '/202_spaghetti-bolognese.jpg', 10.00, 12.00, 'mittwoch'),
('Tomaten-Mozzarella-Auflauf', '/Download.jpg', 10.00, 12.00, 'mittwoch'),
('Schweinebraten mit Kn\xF6del', '/reis_haehnchen_pfanne_2.jpg', 10.00, 12.00, 'donnerstag'),
('Nudelauflauf', '/202_spaghetti-bolognese.jpg', 10.00, 12.00, 'donnerstag'),
('Gr\xFCne Bohnen Eintopf', '/Download.jpg', 10.00, 12.00, 'donnerstag'),
('Currywurst mit Pommes', '/reis_haehnchen_pfanne_2.jpg', 10.00, 12.00, 'freitag'),
('Pizza Margherita', '/202_spaghetti-bolognese.jpg', 10.00, 12.00, 'freitag'),
('Linsensuppe', '/Download.jpg', 10.00, 12.00, 'freitag');
