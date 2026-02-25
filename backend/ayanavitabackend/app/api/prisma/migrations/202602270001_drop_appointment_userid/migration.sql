-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_userId_fkey`;

-- DropIndex
DROP INDEX `Appointment_userId_idx` ON `Appointment`;

-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `userId`;
