-- Drop old unique index before dropping column
DROP INDEX `ServiceCategory_code_key` ON `ServiceCategory`;

-- Remove unused columns from ServiceCategory
ALTER TABLE `ServiceCategory`
  DROP COLUMN `code`,
  DROP COLUMN `isActive`;
