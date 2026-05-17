-- CreateTable
CREATE TABLE `ContratoAnual` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anio` INTEGER NOT NULL,
    `bolsaVariableHoras` INTEGER NOT NULL DEFAULT 0,
    `observaciones` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ContratoAnual_anio_key`(`anio`),
    INDEX `ContratoAnual_anio_idx`(`anio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContratoCategoriaHora` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contratoId` INTEGER NOT NULL,
    `codigo` VARCHAR(80) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `contratoHoras` INTEGER NOT NULL DEFAULT 0,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ContratoCategoriaHora_contratoId_codigo_key`(`contratoId`, `codigo`),
    INDEX `ContratoCategoriaHora_contratoId_idx`(`contratoId`),
    INDEX `ContratoCategoriaHora_orden_idx`(`orden`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContratoCategoriaHora` ADD CONSTRAINT `ContratoCategoriaHora_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `ContratoAnual`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
