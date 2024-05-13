/*
  Warnings:

  - Made the column `senha` on table `conta` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `conta` MODIFY `senha` VARCHAR(64) NOT NULL;
