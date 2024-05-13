/*
  Warnings:

  - Added the required column `username` to the `conta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `conta` ADD COLUMN `username` VARCHAR(255) NOT NULL;
