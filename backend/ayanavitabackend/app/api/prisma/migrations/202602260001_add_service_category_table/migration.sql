-- CreateTable
CREATE TABLE `ServiceCategory` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `ServiceCategory_code_key`(`code`),
  UNIQUE INDEX `ServiceCategory_name_key`(`name`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add category relation column first
ALTER TABLE `Service`
  ADD COLUMN `categoryId` INTEGER NULL;

-- Seed default categories
INSERT INTO `ServiceCategory` (`code`, `name`, `isActive`, `createdAt`, `updatedAt`) VALUES
  ('SKIN', 'Chăm sóc da', true, NOW(3), NOW(3)),
  ('BODY', 'Chăm sóc cơ thể', true, NOW(3), NOW(3)),
  ('HEALTH', 'Dưỡng sinh', true, NOW(3), NOW(3)),
  ('PACKAGE', 'Combo liệu trình', true, NOW(3), NOW(3)),
  ('OTHER', 'Khác', true, NOW(3), NOW(3));

-- Migrate old textual category => categoryId
UPDATE `Service` s
JOIN `ServiceCategory` c ON c.code =
  CASE LOWER(COALESCE(s.`category`, ''))
    WHEN 'skin' THEN 'SKIN'
    WHEN 'body' THEN 'BODY'
    WHEN 'health' THEN 'HEALTH'
    WHEN 'package' THEN 'PACKAGE'
    ELSE 'OTHER'
  END
SET s.`categoryId` = c.`id`;

-- Drop old column after migration
ALTER TABLE `Service`
  DROP COLUMN `category`;

-- Add FK + index
ALTER TABLE `Service`
  ADD INDEX `Service_categoryId_idx`(`categoryId`),
  ADD CONSTRAINT `Service_categoryId_fkey`
  FOREIGN KEY (`categoryId`) REFERENCES `ServiceCategory`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
