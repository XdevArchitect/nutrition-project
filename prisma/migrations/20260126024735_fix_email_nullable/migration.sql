-- AlterTable
ALTER TABLE `User` MODIFY `email` VARCHAR(191) NULL;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `username` TO `User_username_key`;
