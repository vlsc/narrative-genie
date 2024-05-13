-- DropForeignKey
ALTER TABLE `elemento_narrativo` DROP FOREIGN KEY `fk_Elemento_narrativo_Historia1`;

-- DropForeignKey
ALTER TABLE `historia` DROP FOREIGN KEY `fk_Historia_Conta`;

-- DropForeignKey
ALTER TABLE `lugar` DROP FOREIGN KEY `fk_Lugar_Elemento_narrativo1`;

-- DropForeignKey
ALTER TABLE `outro` DROP FOREIGN KEY `fk_Outro_Elemento_narrativo1`;

-- DropForeignKey
ALTER TABLE `personagem` DROP FOREIGN KEY `fk_Personagem_Elemento_narrativo1`;

-- DropForeignKey
ALTER TABLE `relacao` DROP FOREIGN KEY `fk_Elemento_narrativo_has_Elemento_narrativo_Elemento_narrati1`;

-- DropForeignKey
ALTER TABLE `relacao` DROP FOREIGN KEY `fk_Elemento_narrativo_has_Elemento_narrativo_Elemento_narrati2`;

-- AlterTable
ALTER TABLE `historia` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imgPrompt` VARCHAR(2000) NULL,
    ADD COLUMN `prompt` VARCHAR(2000) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `lugar` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imgPrompt` VARCHAR(2000) NULL,
    ADD COLUMN `prompt` VARCHAR(2000) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `outro` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imgPrompt` VARCHAR(2000) NULL,
    ADD COLUMN `prompt` VARCHAR(2000) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `personagem` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `imgPrompt` VARCHAR(2000) NULL,
    ADD COLUMN `prompt` VARCHAR(2000) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `relacao` ADD COLUMN `prompt` VARCHAR(2000) NULL;

-- CreateIndex
CREATE INDEX `lugar_id_elem_narr_idx` ON `lugar`(`id_elem_narr`);

-- CreateIndex
CREATE INDEX `outro_id_elem_narr_idx` ON `outro`(`id_elem_narr`);

-- CreateIndex
CREATE INDEX `personagem_id_elem_narr_idx` ON `personagem`(`id_elem_narr`);

-- CreateIndex
CREATE INDEX `fk_Elemento_narrativo_has_Elemento_narrativo_Elemento_narrati1` ON `relacao`(`id_elem_narr1`);
