/*
  Warnings:

  - You are about to drop the column `path_img_capa` on the `historia` table. All the data in the column will be lost.
  - You are about to drop the column `imagem` on the `lugar` table. All the data in the column will be lost.
  - You are about to drop the column `imagem` on the `outro` table. All the data in the column will be lost.
  - You are about to drop the column `imagem` on the `personagem` table. All the data in the column will be lost.
  - Added the required column `paths_img_capa` to the `historia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagens` to the `lugar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagens` to the `outro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagens` to the `personagem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `historia` DROP COLUMN `path_img_capa`,
    ADD COLUMN `paths_img_capa` JSON NOT NULL;

-- AlterTable
ALTER TABLE `lugar` DROP COLUMN `imagem`,
    ADD COLUMN `imagens` JSON NOT NULL;

-- AlterTable
ALTER TABLE `outro` DROP COLUMN `imagem`,
    ADD COLUMN `imagens` JSON NOT NULL;

-- AlterTable
ALTER TABLE `personagem` DROP COLUMN `imagem`,
    ADD COLUMN `imagens` JSON NOT NULL;
