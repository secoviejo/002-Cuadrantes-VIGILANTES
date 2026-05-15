-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `rolId` INTEGER NOT NULL,
    `empresaId` INTEGER NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    INDEX `Usuario_rolId_idx`(`rolId`),
    INDEX `Usuario_empresaId_idx`(`empresaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(80) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Rol_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `cif` VARCHAR(50) NULL,
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Empresa_cif_key`(`cif`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trabajador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(80) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `tipo` ENUM('VIGILANTE', 'AUXILIAR', 'JEFE_EQUIPO', 'OTRO') NOT NULL,
    `identificadorProfesional` VARCHAR(80) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `empresaId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Trabajador_codigo_key`(`codigo`),
    INDEX `Trabajador_empresaId_idx`(`empresaId`),
    INDEX `Trabajador_tipo_idx`(`tipo`),
    INDEX `Trabajador_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(80) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(120) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Campus_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Edificio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(80) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `campusId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Edificio_codigo_key`(`codigo`),
    INDEX `Edificio_campusId_idx`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(80) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `perfilRequerido` ENUM('VIGILANTE', 'AUXILIAR', 'CUALQUIERA') NOT NULL,
    `dotacionMinima` INTEGER NOT NULL DEFAULT 1,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `edificioId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Servicio_codigo_key`(`codigo`),
    INDEX `Servicio_edificioId_idx`(`edificioId`),
    INDEX `Servicio_perfilRequerido_idx`(`perfilRequerido`),
    INDEX `Servicio_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Turno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(120) NOT NULL,
    `servicioId` INTEGER NOT NULL,
    `fecha` DATE NOT NULL,
    `horaInicio` DATETIME(3) NOT NULL,
    `horaFin` DATETIME(3) NOT NULL,
    `estado` ENUM('SIN_CUBRIR', 'PARCIAL', 'CUBIERTO', 'INCIDENCIA', 'CANCELADO') NOT NULL DEFAULT 'SIN_CUBRIR',
    `dotacionMinima` INTEGER NOT NULL DEFAULT 1,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Turno_codigo_key`(`codigo`),
    INDEX `Turno_servicioId_idx`(`servicioId`),
    INDEX `Turno_fecha_idx`(`fecha`),
    INDEX `Turno_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AsignacionTurno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `turnoId` INTEGER NOT NULL,
    `trabajadorId` INTEGER NOT NULL,
    `estado` ENUM('ASIGNADO', 'CONFIRMADO', 'SUSTITUIDO', 'CANCELADO') NOT NULL DEFAULT 'ASIGNADO',
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `AsignacionTurno_trabajadorId_idx`(`trabajadorId`),
    INDEX `AsignacionTurno_estado_idx`(`estado`),
    UNIQUE INDEX `AsignacionTurno_turnoId_trabajadorId_key`(`turnoId`, `trabajadorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ausencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trabajadorId` INTEGER NOT NULL,
    `tipo` ENUM('VACACIONES', 'BAJA', 'PERMISO', 'INDISPONIBILIDAD', 'OTRO') NOT NULL,
    `fechaInicio` DATE NOT NULL,
    `fechaFin` DATE NOT NULL,
    `motivo` VARCHAR(255) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `Ausencia_trabajadorId_idx`(`trabajadorId`),
    INDEX `Ausencia_fechaInicio_fechaFin_idx`(`fechaInicio`, `fechaFin`),
    INDEX `Ausencia_tipo_idx`(`tipo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sustitucion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `turnoId` INTEGER NOT NULL,
    `trabajadorOriginalId` INTEGER NOT NULL,
    `trabajadorSustitutoId` INTEGER NULL,
    `motivo` VARCHAR(255) NOT NULL,
    `comunicadaEn` DATETIME(3) NULL,
    `cumplePreaviso` BOOLEAN NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `Sustitucion_turnoId_idx`(`turnoId`),
    INDEX `Sustitucion_trabajadorOriginalId_idx`(`trabajadorOriginalId`),
    INDEX `Sustitucion_trabajadorSustitutoId_idx`(`trabajadorSustitutoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Incidencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `turnoId` INTEGER NULL,
    `trabajadorId` INTEGER NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `estado` ENUM('ABIERTA', 'EN_CURSO', 'CERRADA') NOT NULL DEFAULT 'ABIERTA',
    `creadaEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cerradaEn` DATETIME(3) NULL,
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `Incidencia_turnoId_idx`(`turnoId`),
    INDEX `Incidencia_trabajadorId_idx`(`trabajadorId`),
    INDEX `Incidencia_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificacionCobertura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `turnoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `estado` ENUM('CUBIERTO', 'INCIDENCIA', 'DESCUBIERTO') NOT NULL,
    `nota` TEXT NULL,
    `verificadaEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VerificacionCobertura_turnoId_idx`(`turnoId`),
    INDEX `VerificacionCobertura_usuarioId_idx`(`usuarioId`),
    INDEX `VerificacionCobertura_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalendarioLaboral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(120) NOT NULL,
    `fecha` DATE NOT NULL,
    `tipo` ENUM('FESTIVO', 'LECTIVO', 'ESPECIAL', 'CIERRE') NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `campusId` INTEGER NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CalendarioLaboral_codigo_key`(`codigo`),
    INDEX `CalendarioLaboral_fecha_idx`(`fecha`),
    INDEX `CalendarioLaboral_tipo_idx`(`tipo`),
    INDEX `CalendarioLaboral_campusId_idx`(`campusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Auditoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NULL,
    `accion` VARCHAR(120) NOT NULL,
    `entidad` VARCHAR(120) NOT NULL,
    `entidadId` VARCHAR(120) NULL,
    `detalle` JSON NULL,
    `creadaEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Auditoria_usuarioId_idx`(`usuarioId`),
    INDEX `Auditoria_entidad_entidadId_idx`(`entidad`, `entidadId`),
    INDEX `Auditoria_creadaEn_idx`(`creadaEn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Rol`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trabajador` ADD CONSTRAINT `Trabajador_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edificio` ADD CONSTRAINT `Edificio_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_edificioId_fkey` FOREIGN KEY (`edificioId`) REFERENCES `Edificio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turno` ADD CONSTRAINT `Turno_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AsignacionTurno` ADD CONSTRAINT `AsignacionTurno_turnoId_fkey` FOREIGN KEY (`turnoId`) REFERENCES `Turno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AsignacionTurno` ADD CONSTRAINT `AsignacionTurno_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `Trabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ausencia` ADD CONSTRAINT `Ausencia_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `Trabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sustitucion` ADD CONSTRAINT `Sustitucion_turnoId_fkey` FOREIGN KEY (`turnoId`) REFERENCES `Turno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sustitucion` ADD CONSTRAINT `Sustitucion_trabajadorOriginalId_fkey` FOREIGN KEY (`trabajadorOriginalId`) REFERENCES `Trabajador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sustitucion` ADD CONSTRAINT `Sustitucion_trabajadorSustitutoId_fkey` FOREIGN KEY (`trabajadorSustitutoId`) REFERENCES `Trabajador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Incidencia` ADD CONSTRAINT `Incidencia_turnoId_fkey` FOREIGN KEY (`turnoId`) REFERENCES `Turno`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Incidencia` ADD CONSTRAINT `Incidencia_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `Trabajador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerificacionCobertura` ADD CONSTRAINT `VerificacionCobertura_turnoId_fkey` FOREIGN KEY (`turnoId`) REFERENCES `Turno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerificacionCobertura` ADD CONSTRAINT `VerificacionCobertura_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalendarioLaboral` ADD CONSTRAINT `CalendarioLaboral_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auditoria` ADD CONSTRAINT `Auditoria_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
