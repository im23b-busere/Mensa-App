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
  `status` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
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
TRUNCATE TABLE menus;

INSERT INTO `menus` (`title`, `image`, `student_price`, `teacher_price`, `day`) VALUES
('Hähnchen-Gemüsepfanne mit Reis', '/reis_haehnchen_pfanne_2.jpg', 8.90, 10.90, 'montag'),
('Spaghetti mit Hackfleisch-Tomatensauce', '/202_spaghetti-bolognese.jpg', 7.90, 9.90, 'montag'),
('Gemüse-Lasagne mit Spinat und Ricotta', '/Download.jpg', 7.50, 9.50, 'montag'),

('Rindergeschnetzeltes mit Reis', '/Geschnetzeltes-mit-Reis.jpg', 9.80, 11.80, 'dienstag'),
('Penne Arrabiata', '/Penne-arrabbiata.jpg', 6.90, 8.90, 'dienstag'),
('Gemüse-Curry', '/Gemüse-Curry.jpg', 7.20, 9.20, 'dienstag'),

('Fischstäbchen mit Kartoffelsalat', '/Fischstäbchen-mit-Kartoffelsalat.jpg', 8.50, 10.50, 'mittwoch'),
('Käsespätzle', '/Käsespätzle.jpg', 6.80, 8.80, 'mittwoch'),
('Tomaten-Mozzarella-Auflauf', '/Tomaten-Mozzarella-Auflauf.jpg', 7.00, 9.00, 'mittwoch'),

('Schweinebraten mit Knödel', '/Schweinebraten-mit-Knödel.jpg', 9.90, 11.90, 'donnerstag'),
('Nudelauflauf', '/Nudelauflauf.jpg', 7.00, 9.00, 'donnerstag'),
('Grüne Bohnen Eintopf', '/Grüne-Bohnen-Eintopf.jpg', 6.50, 8.50, 'donnerstag'),

('Currywurst mit Pommes', '/Currywurst-Pommes.jpg', 7.90, 9.90, 'freitag'),
('Pizza Margherita', '/PizzaMargherita.jpg', 6.90, 8.90, 'freitag'),
('Linsensuppe', '/Linsensuppe.jpg', 5.90, 7.90, 'freitag');

-- Update existing orders to have appropriate status based on pickup time
UPDATE `orders` 
SET `status` = CASE 
  WHEN `pickup_at` < NOW() THEN 'completed'
  ELSE 'pending'
END;
