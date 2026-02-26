CREATE TABLE `BranchTranslation` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `branchId` INTEGER NOT NULL,
  `locale` VARCHAR(10) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `BranchTranslation_branchId_locale_key`(`branchId`, `locale`),
  INDEX `BranchTranslation_locale_idx`(`locale`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ServiceCategoryTranslation` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `categoryId` INTEGER NOT NULL,
  `locale` VARCHAR(10) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `ServiceCategoryTranslation_categoryId_locale_key`(`categoryId`, `locale`),
  INDEX `ServiceCategoryTranslation_locale_idx`(`locale`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ServiceTranslation` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `serviceId` INTEGER NOT NULL,
  `locale` VARCHAR(10) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `goals` JSON NULL,
  `suitableFor` JSON NULL,
  `process` JSON NULL,
  `tag` VARCHAR(80) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `ServiceTranslation_serviceId_locale_key`(`serviceId`, `locale`),
  INDEX `ServiceTranslation_locale_idx`(`locale`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `SpecialistTranslation` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `specialistId` INTEGER NOT NULL,
  `locale` VARCHAR(10) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `bio` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `SpecialistTranslation_specialistId_locale_key`(`specialistId`, `locale`),
  INDEX `SpecialistTranslation_locale_idx`(`locale`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `BranchTranslation` ADD CONSTRAINT `BranchTranslation_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ServiceCategoryTranslation` ADD CONSTRAINT `ServiceCategoryTranslation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ServiceCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ServiceTranslation` ADD CONSTRAINT `ServiceTranslation_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `SpecialistTranslation` ADD CONSTRAINT `SpecialistTranslation_specialistId_fkey` FOREIGN KEY (`specialistId`) REFERENCES `Specialist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
