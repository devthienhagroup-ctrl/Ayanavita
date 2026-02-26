CREATE TABLE `CourseTopic` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `description` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `CourseTopic_name_key`(`name`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Course`
  ADD COLUMN `topicId` INTEGER NULL,
  ADD INDEX `Course_topicId_idx`(`topicId`);

ALTER TABLE `Course`
  ADD CONSTRAINT `Course_topicId_fkey`
  FOREIGN KEY (`topicId`) REFERENCES `CourseTopic`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;
