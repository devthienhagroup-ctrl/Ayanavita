-- Add branchId to Specialist
ALTER TABLE `Specialist` ADD COLUMN `branchId` INTEGER NULL;

UPDATE `Specialist` s
LEFT JOIN (
  SELECT `specialistId`, MIN(`branchId`) AS `branchId`
  FROM `BranchSpecialist`
  GROUP BY `specialistId`
) bs ON bs.`specialistId` = s.`id`
SET s.`branchId` = COALESCE(bs.`branchId`, (SELECT `id` FROM `Branch` ORDER BY `id` ASC LIMIT 1))
WHERE s.`branchId` IS NULL;

ALTER TABLE `Specialist` MODIFY `branchId` INTEGER NOT NULL;
CREATE INDEX `Specialist_branchId_idx` ON `Specialist`(`branchId`);

-- New relation table: Specialist N-N BranchService
CREATE TABLE `SpecialistBranchService` (
  `specialistId` INTEGER NOT NULL,
  `branchId` INTEGER NOT NULL,
  `serviceId` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `SpecialistBranchService_branchId_serviceId_idx`(`branchId`, `serviceId`),
  PRIMARY KEY (`specialistId`, `branchId`, `serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO `SpecialistBranchService` (`specialistId`, `branchId`, `serviceId`)
SELECT ss.`specialistId`, sp.`branchId`, ss.`serviceId`
FROM `ServiceSpecialist` ss
INNER JOIN `Specialist` sp ON sp.`id` = ss.`specialistId`
INNER JOIN `BranchService` bs ON bs.`branchId` = sp.`branchId` AND bs.`serviceId` = ss.`serviceId`;

ALTER TABLE `Specialist` ADD CONSTRAINT `Specialist_branchId_fkey`
  FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `SpecialistBranchService` ADD CONSTRAINT `SpecialistBranchService_specialistId_fkey`
  FOREIGN KEY (`specialistId`) REFERENCES `Specialist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `SpecialistBranchService` ADD CONSTRAINT `SpecialistBranchService_branchId_serviceId_fkey`
  FOREIGN KEY (`branchId`, `serviceId`) REFERENCES `BranchService`(`branchId`, `serviceId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Remove old incorrect relation tables
DROP TABLE `ServiceSpecialist`;
DROP TABLE `BranchSpecialist`;
