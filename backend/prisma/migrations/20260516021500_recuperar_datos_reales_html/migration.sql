-- AlterTable
ALTER TABLE `Auditoria` MODIFY `detalle` JSON NULL;

-- AlterTable
ALTER TABLE `Servicio` ADD COLUMN `horario` VARCHAR(191) NULL,
    ADD COLUMN `modalidad` VARCHAR(80) NULL,
    ADD COLUMN `orden` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tipoOperativo` VARCHAR(80) NULL,
    ADD COLUMN `vehiculo` VARCHAR(191) NULL,
    ADD COLUMN `visibleCuadrante` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `VerificacionCobertura` ADD COLUMN `puestoId` INTEGER NULL;

-- CreateTable
CREATE TABLE `HorasContratoServicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servicioId` INTEGER NOT NULL,
    `anio` INTEGER NOT NULL,
    `mes` INTEGER NULL,
    `horasPlanificadas` INTEGER NOT NULL DEFAULT 0,
    `horasEjecutadas` INTEGER NULL,
    `horasAnuales` INTEGER NULL,
    `observacion` VARCHAR(255) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `HorasContratoServicio_anio_mes_idx`(`anio`, `mes`),
    UNIQUE INDEX `HorasContratoServicio_servicioId_anio_mes_key`(`servicioId`, `anio`, `mes`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PuestoCobertura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(120) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `etiqueta` VARCHAR(80) NULL,
    `meta` VARCHAR(191) NULL,
    `iniciales` VARCHAR(10) NULL,
    `turnoCodigo` VARCHAR(10) NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 0,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `servicioId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PuestoCobertura_codigo_key`(`codigo`),
    INDEX `PuestoCobertura_servicioId_idx`(`servicioId`),
    INDEX `PuestoCobertura_turnoCodigo_idx`(`turnoCodigo`),
    INDEX `PuestoCobertura_activo_idx`(`activo`),
    INDEX `PuestoCobertura_orden_idx`(`orden`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Servicio_orden_idx` ON `Servicio`(`orden`);

-- CreateIndex
CREATE INDEX `VerificacionCobertura_puestoId_idx` ON `VerificacionCobertura`(`puestoId`);

-- AddForeignKey
ALTER TABLE `VerificacionCobertura` ADD CONSTRAINT `VerificacionCobertura_puestoId_fkey` FOREIGN KEY (`puestoId`) REFERENCES `PuestoCobertura`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HorasContratoServicio` ADD CONSTRAINT `HorasContratoServicio_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PuestoCobertura` ADD CONSTRAINT `PuestoCobertura_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

