ALTER TABLE `User`
  MODIFY `role` ENUM('USER', 'ADMIN', 'MANAGER', 'STAFF') NOT NULL DEFAULT 'USER';

ALTER TABLE `Specialist`
  ADD COLUMN `userId` INT NULL;

INSERT INTO `User` (`email`, `password`, `name`, `role`, `isActive`, `createdAt`, `updatedAt`)
SELECT
  CONCAT('staff+', `id`, '@ayanavita.local') AS `email`,
  '$2b$10$hzkj0v7M2siYf2uP0MKruOFxVQpBv8f3glwTyQ3PDUotmKHxVf95.' AS `password`,
  `name`,
  'STAFF' AS `role`,
  true,
  NOW(),
  NOW()
FROM `Specialist`
WHERE `userId` IS NULL;

UPDATE `Specialist` `s`
JOIN `User` `u` ON `u`.`email` = CONCAT('staff+', `s`.`id`, '@ayanavita.local')
SET `s`.`userId` = `u`.`id`
WHERE `s`.`userId` IS NULL;

ALTER TABLE `Specialist`
  MODIFY `userId` INT NOT NULL,
  ADD UNIQUE INDEX `Specialist_userId_key` (`userId`),
  ADD CONSTRAINT `Specialist_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
