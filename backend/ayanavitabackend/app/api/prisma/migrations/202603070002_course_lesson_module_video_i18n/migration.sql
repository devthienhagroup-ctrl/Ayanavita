-- Course metadata + i18n
ALTER TABLE `Course`
  ADD COLUMN `titleI18n` JSON NULL,
  ADD COLUMN `descriptionI18n` JSON NULL,
  ADD COLUMN `shortDescriptionI18n` JSON NULL,
  ADD COLUMN `objectives` JSON NULL,
  ADD COLUMN `targetAudience` JSON NULL,
  ADD COLUMN `benefits` JSON NULL,
  ADD COLUMN `ratingAvg` DOUBLE NOT NULL DEFAULT 0,
  ADD COLUMN `ratingCount` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `enrollmentCount` INTEGER NOT NULL DEFAULT 0;

-- Lesson metadata + i18n
ALTER TABLE `Lesson`
  ADD COLUMN `description` LONGTEXT NULL,
  ADD COLUMN `titleI18n` JSON NULL,
  ADD COLUMN `descriptionI18n` JSON NULL;

-- Lesson module table
CREATE TABLE `LessonModule` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `lessonId` INTEGER NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NULL,
  `titleI18n` JSON NULL,
  `descriptionI18n` JSON NULL,
  `order` INTEGER NOT NULL DEFAULT 0,
  `published` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `LessonModule_lessonId_order_idx`(`lessonId`, `order`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Lesson video table
CREATE TABLE `LessonVideo` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `moduleId` INTEGER NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NULL,
  `titleI18n` JSON NULL,
  `descriptionI18n` JSON NULL,
  `sourceUrl` VARCHAR(191) NULL,
  `hlsPlaylistKey` VARCHAR(191) NULL,
  `durationSec` INTEGER NOT NULL DEFAULT 0,
  `order` INTEGER NOT NULL DEFAULT 0,
  `published` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `LessonVideo_moduleId_order_idx`(`moduleId`, `order`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `LessonModule`
  ADD CONSTRAINT `LessonModule_lessonId_fkey`
  FOREIGN KEY (`lessonId`) REFERENCES `Lesson`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `LessonVideo`
  ADD CONSTRAINT `LessonVideo_moduleId_fkey`
  FOREIGN KEY (`moduleId`) REFERENCES `LessonModule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
