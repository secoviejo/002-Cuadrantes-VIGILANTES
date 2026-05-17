/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.6-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: cuadrantes_vigilantes_dev
-- ------------------------------------------------------
-- Server version	11.8.6-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `AsignacionTurno`
--

DROP TABLE IF EXISTS `AsignacionTurno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `AsignacionTurno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `turnoId` int(11) NOT NULL,
  `trabajadorId` int(11) NOT NULL,
  `estado` enum('ASIGNADO','CONFIRMADO','SUSTITUIDO','CANCELADO') NOT NULL DEFAULT 'ASIGNADO',
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AsignacionTurno_turnoId_trabajadorId_key` (`turnoId`,`trabajadorId`),
  KEY `AsignacionTurno_trabajadorId_idx` (`trabajadorId`),
  KEY `AsignacionTurno_estado_idx` (`estado`),
  CONSTRAINT `AsignacionTurno_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `Trabajador` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `AsignacionTurno_turnoId_fkey` FOREIGN KEY (`turnoId`) REFERENCES `Turno` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AsignacionTurno`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `AsignacionTurno` WRITE;
/*!40000 ALTER TABLE `AsignacionTurno` DISABLE KEYS */;
INSERT INTO `AsignacionTurno` VALUES
(1,257,1,'CONFIRMADO','2026-05-17 16:49:38.319','2026-05-17 16:49:38.319');
/*!40000 ALTER TABLE `AsignacionTurno` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Auditoria`
--

DROP TABLE IF EXISTS `Auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Auditoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuarioId` int(11) DEFAULT NULL,
  `accion` varchar(120) NOT NULL,
  `entidad` varchar(120) NOT NULL,
  `entidadId` varchar(120) DEFAULT NULL,
  `detalle` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detalle`)),
  `creadaEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Auditoria_usuarioId_idx` (`usuarioId`),
  KEY `Auditoria_entidad_entidadId_idx` (`entidad`,`entidadId`),
  KEY `Auditoria_creadaEn_idx` (`creadaEn`),
  CONSTRAINT `Auditoria_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Auditoria`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Auditoria` WRITE;
/*!40000 ALTER TABLE `Auditoria` DISABLE KEYS */;
INSERT INTO `Auditoria` VALUES
(1,3,'LOGIN','Usuario','3','{\"email\":\"admin.demo@example.com\"}','2026-05-17 16:50:29.110'),
(2,3,'UPDATE','ContratoAnual','2026','{\"anterior\":{\"id\":1,\"anio\":2026,\"bolsaVariableHoras\":2000,\"observaciones\":\"Datos iniciales recuperados del PTT-Vigilancia-UZ.md\",\"contratoAnual\":63508,\"categorias\":[{\"codigo\":\"LABORAL_DIURNO\",\"nombre\":\"Laboral diurno\",\"contratoHoras\":27656,\"orden\":1},{\"codigo\":\"LABORAL_NOCTURNO\",\"nombre\":\"Laboral nocturno\",\"contratoHoras\":15944,\"orden\":2},{\"codigo\":\"FESTIVO_DIURNO\",\"nombre\":\"Festivo diurno\",\"contratoHoras\":12740,\"orden\":3},{\"codigo\":\"FESTIVO_NOCTURNO\",\"nombre\":\"Festivo nocturno\",\"contratoHoras\":7168,\"orden\":4}]},\"actualizado\":{\"id\":1,\"anio\":2026,\"bolsaVariableHoras\":2100,\"observaciones\":\"Prueba automatizada Codex\",\"contratoAnual\":63508,\"categorias\":[{\"codigo\":\"LABORAL_DIURNO\",\"nombre\":\"Laboral diurno\",\"contratoHoras\":27656,\"orden\":1},{\"codigo\":\"LABORAL_NOCTURNO\",\"nombre\":\"Laboral nocturno\",\"contratoHoras\":15944,\"orden\":2},{\"codigo\":\"FESTIVO_DIURNO\",\"nombre\":\"Festivo diurno\",\"contratoHoras\":12740,\"orden\":3},{\"codigo\":\"FESTIVO_NOCTURNO\",\"nombre\":\"Festivo nocturno\",\"contratoHoras\":7168,\"orden\":4}]}}','2026-05-17 16:50:29.255'),
(3,3,'UPDATE','ContratoAnual','2026','{\"anterior\":{\"id\":1,\"anio\":2026,\"bolsaVariableHoras\":2100,\"observaciones\":\"Prueba automatizada Codex\",\"contratoAnual\":63508,\"categorias\":[{\"codigo\":\"LABORAL_DIURNO\",\"nombre\":\"Laboral diurno\",\"contratoHoras\":27656,\"orden\":1},{\"codigo\":\"LABORAL_NOCTURNO\",\"nombre\":\"Laboral nocturno\",\"contratoHoras\":15944,\"orden\":2},{\"codigo\":\"FESTIVO_DIURNO\",\"nombre\":\"Festivo diurno\",\"contratoHoras\":12740,\"orden\":3},{\"codigo\":\"FESTIVO_NOCTURNO\",\"nombre\":\"Festivo nocturno\",\"contratoHoras\":7168,\"orden\":4}]},\"actualizado\":{\"id\":1,\"anio\":2026,\"bolsaVariableHoras\":2000,\"observaciones\":\"Datos iniciales recuperados del PTT-Vigilancia-UZ.md\",\"contratoAnual\":63508,\"categorias\":[{\"codigo\":\"LABORAL_DIURNO\",\"nombre\":\"Laboral diurno\",\"contratoHoras\":27656,\"orden\":1},{\"codigo\":\"LABORAL_NOCTURNO\",\"nombre\":\"Laboral nocturno\",\"contratoHoras\":15944,\"orden\":2},{\"codigo\":\"FESTIVO_DIURNO\",\"nombre\":\"Festivo diurno\",\"contratoHoras\":12740,\"orden\":3},{\"codigo\":\"FESTIVO_NOCTURNO\",\"nombre\":\"Festivo nocturno\",\"contratoHoras\":7168,\"orden\":4}]}}','2026-05-17 16:50:42.595'),
(4,3,'LOGIN','Usuario','3','{\"email\":\"admin.demo@example.com\"}','2026-05-17 16:51:18.321'),
(5,3,'UPDATE','ContratoAnual','2026','{\"anterior\":{\"id\":1,\"anio\":2026,\"bolsaVariableHoras\":2000,\"observaciones\":\"Datos iniciales recuperados del PTT-Vigilancia-UZ.md\",\"contratoAnual\":63508,\"categorias\":[{\"codigo\":\"LABORAL_DIURNO\",\"nombre\":\"Laboral diurno\",\"contratoHoras\":27656,\"orden\":1},{\"codigo\":\"LABORAL_NOCTURNO\",\"nombre\":\"Laboral nocturno\",\"contratoHoras\":15944,\"orden\":2},{\"codigo\":\"FESTIVO_DIURNO\",\"nombre\":\"Festivo diurno\",\"contratoHoras\":12740,\"orden\":3},{\"codigo\":\"FESTIVO_NOCTURNO\",\"nombre\":\"Festivo nocturno\",\"contratoHoras\":7168,\"orden\":4}]},\"actualizado\":{\"id\":1,\"anio\":2026,\"bolsaVariableHoras\":2100,\"observaciones\":\"Prueba automatizada Codex\",\"contratoAnual\":63508,\"categorias\":[{\"codigo\":\"LABORAL_DIURNO\",\"nombre\":\"Laboral diurno\",\"contratoHoras\":27656,\"orden\":1},{\"codigo\":\"LABORAL_NOCTURNO\",\"nombre\":\"Laboral nocturno\",\"contratoHoras\":15944,\"orden\":2},{\"codigo\":\"FESTIVO_DIURNO\",\"nombre\":\"Festivo diurno\",\"contratoHoras\":12740,\"orden\":3},{\"codigo\":\"FESTIVO_NOCTURNO\",\"nombre\":\"Festivo nocturno\",\"contratoHoras\":7168,\"orden\":4}]}}','2026-05-17 16:51:18.415'),
(6,3,'UPDATE','ContratoAnual','2026','{\"anterior\":{\"id\":1,\"anio\":2026,\"bolsaVariableHoras\":2100,\"observaciones\":\"Prueba automatizada Codex\",\"contratoAnual\":63508,\"categorias\":[{\"codigo\":\"LABORAL_DIURNO\",\"nombre\":\"Laboral diurno\",\"contratoHoras\":27656,\"orden\":1},{\"codigo\":\"LABORAL_NOCTURNO\",\"nombre\":\"Laboral nocturno\",\"contratoHoras\":15944,\"orden\":2},{\"codigo\":\"FESTIVO_DIURNO\",\"nombre\":\"Festivo diurno\",\"contratoHoras\":12740,\"orden\":3},{\"codigo\":\"FESTIVO_NOCTURNO\",\"nombre\":\"Festivo nocturno\",\"contratoHoras\":7168,\"orden\":4}]},\"actualizado\":{\"id\":1,\"anio\":2026,\"bolsaVariableHoras\":2000,\"observaciones\":\"Datos iniciales recuperados del PTT-Vigilancia-UZ.md\",\"contratoAnual\":63508,\"categorias\":[{\"codigo\":\"LABORAL_DIURNO\",\"nombre\":\"Laboral diurno\",\"contratoHoras\":27656,\"orden\":1},{\"codigo\":\"LABORAL_NOCTURNO\",\"nombre\":\"Laboral nocturno\",\"contratoHoras\":15944,\"orden\":2},{\"codigo\":\"FESTIVO_DIURNO\",\"nombre\":\"Festivo diurno\",\"contratoHoras\":12740,\"orden\":3},{\"codigo\":\"FESTIVO_NOCTURNO\",\"nombre\":\"Festivo nocturno\",\"contratoHoras\":7168,\"orden\":4}]}}','2026-05-17 16:51:18.490'),
(7,3,'LOGIN','Usuario','3','{\"email\":\"admin.demo@example.com\"}','2026-05-17 17:02:32.482'),
(8,3,'LOGIN','Usuario','3','{\"email\":\"admin.demo@example.com\"}','2026-05-17 17:09:44.576'),
(9,3,'LOGIN','Usuario','3','{\"email\":\"admin.demo@example.com\"}','2026-05-17 17:15:57.335');
/*!40000 ALTER TABLE `Auditoria` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Ausencia`
--

DROP TABLE IF EXISTS `Ausencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Ausencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trabajadorId` int(11) NOT NULL,
  `tipo` enum('VACACIONES','BAJA','PERMISO','INDISPONIBILIDAD','OTRO') NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Ausencia_trabajadorId_idx` (`trabajadorId`),
  KEY `Ausencia_fechaInicio_fechaFin_idx` (`fechaInicio`,`fechaFin`),
  KEY `Ausencia_tipo_idx` (`tipo`),
  CONSTRAINT `Ausencia_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `Trabajador` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ausencia`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Ausencia` WRITE;
/*!40000 ALTER TABLE `Ausencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `Ausencia` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `CalendarioLaboral`
--

DROP TABLE IF EXISTS `CalendarioLaboral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `CalendarioLaboral` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(120) NOT NULL,
  `fecha` date NOT NULL,
  `tipo` enum('FESTIVO','LECTIVO','ESPECIAL','CIERRE') NOT NULL,
  `descripcion` varchar(191) NOT NULL,
  `campusId` int(11) DEFAULT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `CalendarioLaboral_codigo_key` (`codigo`),
  KEY `CalendarioLaboral_fecha_idx` (`fecha`),
  KEY `CalendarioLaboral_tipo_idx` (`tipo`),
  KEY `CalendarioLaboral_campusId_idx` (`campusId`),
  CONSTRAINT `CalendarioLaboral_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CalendarioLaboral`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `CalendarioLaboral` WRITE;
/*!40000 ALTER TABLE `CalendarioLaboral` DISABLE KEYS */;
INSERT INTO `CalendarioLaboral` VALUES
(1,'CAL_2026_0101_ANO_NUEVO','2026-01-01','FESTIVO','Ano Nuevo',NULL,'2026-05-17 16:49:38.339'),
(2,'CAL_2026_0106_REYES','2026-01-06','FESTIVO','Reyes',NULL,'2026-05-17 16:49:38.353'),
(3,'CAL_2026_0305_CINCOMARZADA','2026-03-05','FESTIVO','Cincomarzada',1,'2026-05-17 16:49:38.368'),
(4,'CAL_2026_0423_SAN_JORGE','2026-04-23','FESTIVO','San Jorge - Dia de Aragon',NULL,'2026-05-17 16:49:38.378'),
(5,'CAL_2026_0501_TRABAJO','2026-05-01','FESTIVO','Dia del Trabajo',NULL,'2026-05-17 16:49:38.389'),
(6,'CAL_2026_0529_SAN_FERNANDO_HUESCA','2026-05-29','FESTIVO','San Fernando (Huesca)',6,'2026-05-17 16:49:38.401'),
(7,'CAL_2026_0710_SAN_CRISTOBAL_HUESCA','2026-07-10','FESTIVO','San Cristobal (Huesca)',6,'2026-05-17 16:49:38.410'),
(8,'CAL_2026_0815_ASUNCION','2026-08-15','FESTIVO','Asuncion',NULL,'2026-05-17 16:49:38.421'),
(9,'CAL_2026_1012_FIESTA_NACIONAL','2026-10-12','FESTIVO','Fiesta Nacional',NULL,'2026-05-17 16:49:38.436'),
(10,'CAL_2026_1013_PILAR','2026-10-13','FESTIVO','Pilar',1,'2026-05-17 16:49:38.445'),
(11,'CAL_2026_1225_NAVIDAD','2026-12-25','FESTIVO','Navidad',NULL,'2026-05-17 16:49:38.456');
/*!40000 ALTER TABLE `CalendarioLaboral` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Campus`
--

DROP TABLE IF EXISTS `Campus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Campus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(80) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `ciudad` varchar(120) DEFAULT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Campus_codigo_key` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Campus`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Campus` WRITE;
/*!40000 ALTER TABLE `Campus` DISABLE KEYS */;
INSERT INTO `Campus` VALUES
(1,'SAN_FRANCISCO','San Francisco','Zaragoza','2026-05-17 16:49:31.392','2026-05-17 16:49:31.392'),
(2,'PARAISO','Paraiso','Zaragoza','2026-05-17 16:49:31.405','2026-05-17 16:49:31.405'),
(3,'RIO_EBRO','Rio Ebro','Zaragoza','2026-05-17 16:49:31.420','2026-05-17 16:49:31.420'),
(4,'VETERINARIA','Veterinaria','Zaragoza','2026-05-17 16:49:31.429','2026-05-17 16:49:31.429'),
(5,'CECO','CECO','Zaragoza','2026-05-17 16:49:31.438','2026-05-17 16:49:31.438'),
(6,'HUESCA','Huesca','Huesca','2026-05-17 16:49:31.447','2026-05-17 16:49:31.447'),
(7,'TERUEL','Teruel','Teruel','2026-05-17 16:49:31.456','2026-05-17 16:49:31.456'),
(8,'JACA','Jaca','Jaca','2026-05-17 16:49:31.469','2026-05-17 16:49:31.469'),
(9,'MULTICAMPUS','Multi-campus',NULL,'2026-05-17 16:49:31.479','2026-05-17 16:49:31.479');
/*!40000 ALTER TABLE `Campus` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ContratoAnual`
--

DROP TABLE IF EXISTS `ContratoAnual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ContratoAnual` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `anio` int(11) NOT NULL,
  `bolsaVariableHoras` int(11) NOT NULL DEFAULT 0,
  `observaciones` text DEFAULT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ContratoAnual_anio_key` (`anio`),
  KEY `ContratoAnual_anio_idx` (`anio`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContratoAnual`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ContratoAnual` WRITE;
/*!40000 ALTER TABLE `ContratoAnual` DISABLE KEYS */;
INSERT INTO `ContratoAnual` VALUES
(1,2026,2000,'Datos iniciales recuperados del PTT-Vigilancia-UZ.md','2026-05-17 16:49:38.466','2026-05-17 16:51:18.461');
/*!40000 ALTER TABLE `ContratoAnual` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `ContratoCategoriaHora`
--

DROP TABLE IF EXISTS `ContratoCategoriaHora`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ContratoCategoriaHora` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contratoId` int(11) NOT NULL,
  `codigo` varchar(80) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `contratoHoras` int(11) NOT NULL DEFAULT 0,
  `orden` int(11) NOT NULL DEFAULT 0,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ContratoCategoriaHora_contratoId_codigo_key` (`contratoId`,`codigo`),
  KEY `ContratoCategoriaHora_contratoId_idx` (`contratoId`),
  KEY `ContratoCategoriaHora_orden_idx` (`orden`),
  CONSTRAINT `ContratoCategoriaHora_contratoId_fkey` FOREIGN KEY (`contratoId`) REFERENCES `ContratoAnual` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContratoCategoriaHora`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `ContratoCategoriaHora` WRITE;
/*!40000 ALTER TABLE `ContratoCategoriaHora` DISABLE KEYS */;
INSERT INTO `ContratoCategoriaHora` VALUES
(1,1,'LABORAL_DIURNO','Laboral diurno',27656,1,'2026-05-17 16:49:38.480','2026-05-17 16:51:18.466'),
(2,1,'LABORAL_NOCTURNO','Laboral nocturno',15944,2,'2026-05-17 16:49:38.495','2026-05-17 16:51:18.471'),
(3,1,'FESTIVO_DIURNO','Festivo diurno',12740,3,'2026-05-17 16:49:38.510','2026-05-17 16:51:18.476'),
(4,1,'FESTIVO_NOCTURNO','Festivo nocturno',7168,4,'2026-05-17 16:49:38.520','2026-05-17 16:51:18.481');
/*!40000 ALTER TABLE `ContratoCategoriaHora` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Edificio`
--

DROP TABLE IF EXISTS `Edificio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Edificio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(80) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `campusId` int(11) NOT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Edificio_codigo_key` (`codigo`),
  KEY `Edificio_campusId_idx` (`campusId`),
  CONSTRAINT `Edificio_campusId_fkey` FOREIGN KEY (`campusId`) REFERENCES `Campus` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Edificio`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Edificio` WRITE;
/*!40000 ALTER TABLE `Edificio` DISABLE KEYS */;
INSERT INTO `Edificio` VALUES
(1,'SF_INTERFAC','Edificio Interfacultades',1,'2026-05-17 16:49:31.488','2026-05-17 16:49:31.488'),
(2,'PAR_CAMPUS','Campus Paraiso',2,'2026-05-17 16:49:31.500','2026-05-17 16:49:31.500'),
(3,'RE_BETANCOURT','Edificio Betancourt',3,'2026-05-17 16:49:31.510','2026-05-17 16:49:31.510'),
(4,'VET_PRINCIPAL','Facultad de Veterinaria',4,'2026-05-17 16:49:31.519','2026-05-17 16:49:31.519'),
(5,'CECO_CONTROL','Centro de Control CECO',5,'2026-05-17 16:49:31.528','2026-05-17 16:49:31.528'),
(6,'HUE_CAMPUS','Campus de Huesca',6,'2026-05-17 16:49:31.537','2026-05-17 16:49:31.537'),
(7,'TER_CAMPUS','Campus de Teruel',7,'2026-05-17 16:49:31.546','2026-05-17 16:49:31.546'),
(8,'JACA_RESIDENCIA','Residencia Jaca',8,'2026-05-17 16:49:31.555','2026-05-17 16:49:31.555'),
(9,'MULTI_SALAS','Salas de estudio varias',9,'2026-05-17 16:49:31.564','2026-05-17 16:49:31.564');
/*!40000 ALTER TABLE `Edificio` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Empresa`
--

DROP TABLE IF EXISTS `Empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Empresa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(191) NOT NULL,
  `cif` varchar(50) DEFAULT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Empresa_cif_key` (`cif`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Empresa`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Empresa` WRITE;
/*!40000 ALTER TABLE `Empresa` DISABLE KEYS */;
INSERT INTO `Empresa` VALUES
(1,'Empresa Demo Seguridad','DEMO000000',1,'2026-05-17 16:49:31.339','2026-05-17 16:49:31.339');
/*!40000 ALTER TABLE `Empresa` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `HorasContratoServicio`
--

DROP TABLE IF EXISTS `HorasContratoServicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `HorasContratoServicio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `servicioId` int(11) NOT NULL,
  `anio` int(11) NOT NULL,
  `mes` int(11) DEFAULT NULL,
  `horasPlanificadas` int(11) NOT NULL DEFAULT 0,
  `horasEjecutadas` int(11) DEFAULT NULL,
  `horasAnuales` int(11) DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HorasContratoServicio_servicioId_anio_mes_key` (`servicioId`,`anio`,`mes`),
  KEY `HorasContratoServicio_anio_mes_idx` (`anio`,`mes`),
  CONSTRAINT `HorasContratoServicio_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HorasContratoServicio`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `HorasContratoServicio` WRITE;
/*!40000 ALTER TABLE `HorasContratoServicio` DISABLE KEYS */;
INSERT INTO `HorasContratoServicio` VALUES
(1,1,2026,5,1488,1468,NULL,NULL,'2026-05-17 16:49:31.733','2026-05-17 16:49:31.733'),
(2,2,2026,5,744,736,NULL,NULL,'2026-05-17 16:49:31.748','2026-05-17 16:49:31.748'),
(3,3,2026,5,744,736,NULL,NULL,'2026-05-17 16:49:31.763','2026-05-17 16:49:31.763'),
(4,4,2026,5,744,736,NULL,NULL,'2026-05-17 16:49:31.774','2026-05-17 16:49:31.774'),
(5,5,2026,5,912,880,NULL,NULL,'2026-05-17 16:49:31.785','2026-05-17 16:49:31.785'),
(6,7,2026,5,310,310,NULL,NULL,'2026-05-17 16:49:31.796','2026-05-17 16:49:31.796'),
(7,8,2026,5,412,442,NULL,NULL,'2026-05-17 16:49:31.807','2026-05-17 16:49:31.807'),
(8,13,2026,5,40,0,NULL,NULL,'2026-05-17 16:49:31.818','2026-05-17 16:49:31.818');
/*!40000 ALTER TABLE `HorasContratoServicio` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Incidencia`
--

DROP TABLE IF EXISTS `Incidencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Incidencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `turnoId` int(11) DEFAULT NULL,
  `trabajadorId` int(11) DEFAULT NULL,
  `titulo` varchar(191) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('ABIERTA','EN_CURSO','CERRADA') NOT NULL DEFAULT 'ABIERTA',
  `creadaEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `cerradaEn` datetime(3) DEFAULT NULL,
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Incidencia_turnoId_idx` (`turnoId`),
  KEY `Incidencia_trabajadorId_idx` (`trabajadorId`),
  KEY `Incidencia_estado_idx` (`estado`),
  CONSTRAINT `Incidencia_trabajadorId_fkey` FOREIGN KEY (`trabajadorId`) REFERENCES `Trabajador` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Incidencia_turnoId_fkey` FOREIGN KEY (`turnoId`) REFERENCES `Turno` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Incidencia`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Incidencia` WRITE;
/*!40000 ALTER TABLE `Incidencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `Incidencia` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `PuestoCobertura`
--

DROP TABLE IF EXISTS `PuestoCobertura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `PuestoCobertura` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(120) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `etiqueta` varchar(80) DEFAULT NULL,
  `meta` varchar(191) DEFAULT NULL,
  `iniciales` varchar(10) DEFAULT NULL,
  `turnoCodigo` varchar(10) NOT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `servicioId` int(11) NOT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PuestoCobertura_codigo_key` (`codigo`),
  KEY `PuestoCobertura_servicioId_idx` (`servicioId`),
  KEY `PuestoCobertura_turnoCodigo_idx` (`turnoCodigo`),
  KEY `PuestoCobertura_activo_idx` (`activo`),
  KEY `PuestoCobertura_orden_idx` (`orden`),
  CONSTRAINT `PuestoCobertura_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PuestoCobertura`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `PuestoCobertura` WRITE;
/*!40000 ALTER TABLE `PuestoCobertura` DISABLE KEYS */;
INSERT INTO `PuestoCobertura` VALUES
(1,'PUESTO_SF1_M','San Francisco','Vig 1','24/7 - Edificio Interfacultades','SF1','M',1,1,1,'2026-05-17 16:49:31.833','2026-05-17 16:49:31.833'),
(2,'PUESTO_SF2_M','San Francisco','Vig 2','24/7 - Rondas vehiculo','SF2','M',2,1,1,'2026-05-17 16:49:31.848','2026-05-17 16:49:31.848'),
(3,'PUESTO_PAR_M','Paraiso',NULL,'24/7','PAR','M',3,1,2,'2026-05-17 16:49:31.863','2026-05-17 16:49:31.863'),
(4,'PUESTO_VET_M','Veterinaria',NULL,'24/7','VET','M',4,1,3,'2026-05-17 16:49:31.876','2026-05-17 16:49:31.876'),
(5,'PUESTO_RIO_M','Rio Ebro',NULL,'24/7 - Rondas vehiculo','RE','M',5,1,4,'2026-05-17 16:49:31.886','2026-05-17 16:49:31.886'),
(6,'PUESTO_CECO_M','CECO',NULL,'24/7 - Centro de Control','CE','M',6,1,5,'2026-05-17 16:49:31.896','2026-05-17 16:49:31.896'),
(7,'PUESTO_HUE_M','Huesca',NULL,'Variable lectivo - Rondas vehiculo','HU','M',7,1,8,'2026-05-17 16:49:31.907','2026-05-17 16:49:31.907'),
(8,'PUESTO_CECO_JEFE_M','CECO - Jefe de equipo',NULL,'L-V diurno','JE','M',8,1,6,'2026-05-17 16:49:31.918','2026-05-17 16:49:31.918'),
(9,'PUESTO_SF1_T','San Francisco','Vig 1','24/7 - Edificio Interfacultades','SF1','T',1,1,1,'2026-05-17 16:49:31.929','2026-05-17 16:49:31.929'),
(10,'PUESTO_SF2_T','San Francisco','Vig 2','24/7 - Rondas vehiculo','SF2','T',2,1,1,'2026-05-17 16:49:31.940','2026-05-17 16:49:31.940'),
(11,'PUESTO_PAR_T','Paraiso',NULL,'24/7','PAR','T',3,1,2,'2026-05-17 16:49:31.951','2026-05-17 16:49:31.951'),
(12,'PUESTO_VET_T','Veterinaria',NULL,'24/7','VET','T',4,1,3,'2026-05-17 16:49:31.962','2026-05-17 16:49:31.962'),
(13,'PUESTO_RIO_T','Rio Ebro',NULL,'24/7 - Rondas vehiculo','RE','T',5,1,4,'2026-05-17 16:49:31.973','2026-05-17 16:49:31.973'),
(14,'PUESTO_CECO_T','CECO',NULL,'24/7 - Centro de Control','CE','T',6,1,5,'2026-05-17 16:49:31.988','2026-05-17 16:49:31.988'),
(15,'PUESTO_HUE_T','Huesca',NULL,'Variable lectivo - Rondas vehiculo','HU','T',7,1,8,'2026-05-17 16:49:31.999','2026-05-17 16:49:31.999'),
(16,'PUESTO_SF1_N','San Francisco','Vig 1','24/7 - Edificio Interfacultades','SF1','N',1,1,1,'2026-05-17 16:49:32.010','2026-05-17 16:49:32.010'),
(17,'PUESTO_SF2_N','San Francisco','Vig 2','24/7 - Rondas vehiculo','SF2','N',2,1,1,'2026-05-17 16:49:32.021','2026-05-17 16:49:32.021'),
(18,'PUESTO_PAR_N','Paraiso',NULL,'24/7','PAR','N',3,1,2,'2026-05-17 16:49:32.032','2026-05-17 16:49:32.032'),
(19,'PUESTO_VET_N','Veterinaria',NULL,'24/7','VET','N',4,1,3,'2026-05-17 16:49:32.043','2026-05-17 16:49:32.043'),
(20,'PUESTO_RIO_N','Rio Ebro',NULL,'24/7 - Rondas vehiculo','RE','N',5,1,4,'2026-05-17 16:49:32.055','2026-05-17 16:49:32.055'),
(21,'PUESTO_CECO_N','CECO',NULL,'24/7 - Centro de Control','CE','N',6,1,5,'2026-05-17 16:49:32.065','2026-05-17 16:49:32.065'),
(22,'PUESTO_HUE_N','Huesca',NULL,'Variable lectivo - Rondas vehiculo','HU','N',7,1,8,'2026-05-17 16:49:32.075','2026-05-17 16:49:32.075'),
(23,'PUESTO_TER_N','Teruel',NULL,'22:00-08:00','TER','N',8,1,7,'2026-05-17 16:49:32.085','2026-05-17 16:49:32.085');
/*!40000 ALTER TABLE `PuestoCobertura` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Rol`
--

DROP TABLE IF EXISTS `Rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(80) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Rol_nombre_key` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rol`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Rol` WRITE;
/*!40000 ALTER TABLE `Rol` DISABLE KEYS */;
INSERT INTO `Rol` VALUES
(1,'ADMIN','Administracion tecnica de la aplicacion','2026-05-17 16:49:31.305','2026-05-17 16:49:31.305'),
(2,'CONTRATA','Operacion diaria de la empresa adjudicataria','2026-05-17 16:49:31.305','2026-05-17 16:49:31.305'),
(3,'UNIDAD_SEGURIDAD_UZ','Supervision y validacion del servicio','2026-05-17 16:49:31.305','2026-05-17 16:49:31.305');
/*!40000 ALTER TABLE `Rol` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Servicio`
--

DROP TABLE IF EXISTS `Servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Servicio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(80) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `perfilRequerido` enum('VIGILANTE','AUXILIAR','CUALQUIERA') NOT NULL,
  `dotacionMinima` int(11) NOT NULL DEFAULT 1,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `edificioId` int(11) NOT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  `horario` varchar(191) DEFAULT NULL,
  `modalidad` varchar(80) DEFAULT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `tipoOperativo` varchar(80) DEFAULT NULL,
  `vehiculo` varchar(191) DEFAULT NULL,
  `visibleCuadrante` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Servicio_codigo_key` (`codigo`),
  KEY `Servicio_edificioId_idx` (`edificioId`),
  KEY `Servicio_perfilRequerido_idx` (`perfilRequerido`),
  KEY `Servicio_activo_idx` (`activo`),
  KEY `Servicio_orden_idx` (`orden`),
  CONSTRAINT `Servicio_edificioId_fkey` FOREIGN KEY (`edificioId`) REFERENCES `Edificio` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Servicio`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Servicio` WRITE;
/*!40000 ALTER TABLE `Servicio` DISABLE KEYS */;
INSERT INTO `Servicio` VALUES
(1,'SERV_SF_24H','San Francisco','2 vigilantes 24/7','VIGILANTE',2,1,1,'2026-05-17 16:49:31.573','2026-05-17 16:49:31.573','24/7 todo el ano','24/7',1,'Vigilancia','2 x SUV electrico',1),
(2,'SERV_PAR_24H','Paraiso','24/7','VIGILANTE',1,1,2,'2026-05-17 16:49:31.590','2026-05-17 16:49:31.590','24/7 todo el ano','24/7',2,'Vigilancia',NULL,1),
(3,'SERV_VET_24H','Veterinaria','24/7','VIGILANTE',1,1,4,'2026-05-17 16:49:31.605','2026-05-17 16:49:31.605','24/7 todo el ano','24/7',3,'Vigilancia',NULL,1),
(4,'SERV_RE_24H','Rio Ebro','24/7','VIGILANTE',1,1,3,'2026-05-17 16:49:31.616','2026-05-17 16:49:31.616','24/7 todo el ano','24/7',4,'Vigilancia','1 x SUV electrico',1),
(5,'SERV_CECO_24H','CECO','24/7 Centro de Control','VIGILANTE',1,1,5,'2026-05-17 16:49:31.627','2026-05-17 16:49:31.627','24/7 todo el ano','24/7',5,'Vigilancia',NULL,1),
(6,'SERV_CECO_JEFE','CECO Jefe equipo','L-V diurno','VIGILANTE',1,1,5,'2026-05-17 16:49:31.637','2026-05-17 16:49:31.637','L-V diurno (8h)','LABORAL_DIURNO',6,'Coordinacion',NULL,1),
(7,'SERV_TER_NOCTURNO','Teruel','22:00-08:00 sin agosto','VIGILANTE',1,1,7,'2026-05-17 16:49:31.647','2026-05-17 16:49:31.647','22:00-08:00 (sin agosto)','NOCTURNO',7,'Vigilancia',NULL,1),
(8,'SERV_HUE_VARIABLE','Huesca','Variable lectivo/no lectivo','VIGILANTE',1,1,6,'2026-05-17 16:49:31.663','2026-05-17 16:49:31.663','Variable (lectivo/no lectivo/festivos)','VARIABLE',8,'Vigilancia','1 x SUV hibrido',1),
(9,'SERV_OCA_SF','OCA San Francisco','Auxiliar lectivo/no lectivo','AUXILIAR',1,1,1,'2026-05-17 16:49:31.674','2026-05-17 16:49:31.674','L-V dias lectivos / no lectivos','LECTIVO',9,'Auxiliar',NULL,0),
(10,'SERV_CMU_CERBUNA','C.M.U. Pedro Cerbuna','Auxiliar nocturno y fin de semana','AUXILIAR',1,1,2,'2026-05-17 16:49:31.685','2026-05-17 16:49:31.685','Nocturno L-V + 24h fin de semana','NOCTURNO_FDS',10,'Auxiliar',NULL,0),
(11,'SERV_CMU_RAMON_ACIN','C.M.U. Ramon Acin','Auxiliar nocturno y fin de semana','AUXILIAR',1,1,6,'2026-05-17 16:49:31.696','2026-05-17 16:49:31.696','Nocturno L-V + 24h fin de semana','NOCTURNO_FDS',11,'Auxiliar',NULL,0),
(12,'SERV_RES_JACA','Residencia Jaca','A demanda nocturno','AUXILIAR',1,1,8,'2026-05-17 16:49:31.707','2026-05-17 16:49:31.707','22:00-08:00 segun solicitud (~1.900h/ano)','A_DEMANDA',12,'A demanda',NULL,0),
(13,'SERV_SALAS_ESTUDIO','Salas estudio (varias)','Segun calendario academico','AUXILIAR',1,1,9,'2026-05-17 16:49:31.722','2026-05-17 16:49:31.722','Segun calendario academico','A_DEMANDA',13,'A demanda',NULL,0);
/*!40000 ALTER TABLE `Servicio` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Sustitucion`
--

DROP TABLE IF EXISTS `Sustitucion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sustitucion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `turnoId` int(11) NOT NULL,
  `trabajadorOriginalId` int(11) NOT NULL,
  `trabajadorSustitutoId` int(11) DEFAULT NULL,
  `motivo` varchar(255) NOT NULL,
  `comunicadaEn` datetime(3) DEFAULT NULL,
  `cumplePreaviso` tinyint(1) DEFAULT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Sustitucion_turnoId_idx` (`turnoId`),
  KEY `Sustitucion_trabajadorOriginalId_idx` (`trabajadorOriginalId`),
  KEY `Sustitucion_trabajadorSustitutoId_idx` (`trabajadorSustitutoId`),
  CONSTRAINT `Sustitucion_trabajadorOriginalId_fkey` FOREIGN KEY (`trabajadorOriginalId`) REFERENCES `Trabajador` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Sustitucion_trabajadorSustitutoId_fkey` FOREIGN KEY (`trabajadorSustitutoId`) REFERENCES `Trabajador` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Sustitucion_turnoId_fkey` FOREIGN KEY (`turnoId`) REFERENCES `Turno` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sustitucion`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Sustitucion` WRITE;
/*!40000 ALTER TABLE `Sustitucion` DISABLE KEYS */;
/*!40000 ALTER TABLE `Sustitucion` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Trabajador`
--

DROP TABLE IF EXISTS `Trabajador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Trabajador` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(80) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `tipo` enum('VIGILANTE','AUXILIAR','JEFE_EQUIPO','OTRO') NOT NULL,
  `identificadorProfesional` varchar(80) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `empresaId` int(11) NOT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Trabajador_codigo_key` (`codigo`),
  KEY `Trabajador_empresaId_idx` (`empresaId`),
  KEY `Trabajador_tipo_idx` (`tipo`),
  KEY `Trabajador_activo_idx` (`activo`),
  CONSTRAINT `Trabajador_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Trabajador`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Trabajador` WRITE;
/*!40000 ALTER TABLE `Trabajador` DISABLE KEYS */;
INSERT INTO `Trabajador` VALUES
(1,'TRAB_DEMO_001','Vigilante Demo 001','VIGILANTE',NULL,1,1,'2026-05-17 16:49:32.098','2026-05-17 16:49:32.098'),
(2,'TRAB_DEMO_002','Vigilante Demo 002','VIGILANTE',NULL,1,1,'2026-05-17 16:49:32.112','2026-05-17 16:49:32.112'),
(3,'TRAB_DEMO_003','Auxiliar Demo 001','AUXILIAR',NULL,1,1,'2026-05-17 16:49:32.126','2026-05-17 16:49:32.126'),
(4,'TRAB_DEMO_004','Jefe Equipo Demo 001','JEFE_EQUIPO',NULL,1,1,'2026-05-17 16:49:32.136','2026-05-17 16:49:32.136');
/*!40000 ALTER TABLE `Trabajador` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Turno`
--

DROP TABLE IF EXISTS `Turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Turno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(120) NOT NULL,
  `servicioId` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horaInicio` datetime(3) NOT NULL,
  `horaFin` datetime(3) NOT NULL,
  `estado` enum('SIN_CUBRIR','PARCIAL','CUBIERTO','INCIDENCIA','CANCELADO') NOT NULL DEFAULT 'SIN_CUBRIR',
  `dotacionMinima` int(11) NOT NULL DEFAULT 1,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Turno_codigo_key` (`codigo`),
  KEY `Turno_servicioId_idx` (`servicioId`),
  KEY `Turno_fecha_idx` (`fecha`),
  KEY `Turno_estado_idx` (`estado`),
  CONSTRAINT `Turno_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `Servicio` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=569 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Turno`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Turno` WRITE;
/*!40000 ALTER TABLE `Turno` DISABLE KEYS */;
INSERT INTO `Turno` VALUES
(1,'TURNO_SERV_SF_24H_20260501_M',1,'2026-05-01','2026-05-01 06:00:00.000','2026-05-01 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.153','2026-05-17 16:49:32.153'),
(2,'TURNO_SERV_SF_24H_20260501_T',1,'2026-05-01','2026-05-01 14:00:00.000','2026-05-01 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.170','2026-05-17 16:49:32.170'),
(3,'TURNO_SERV_SF_24H_20260501_N',1,'2026-05-01','2026-05-01 22:00:00.000','2026-05-02 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.185','2026-05-17 16:49:32.185'),
(4,'TURNO_SERV_PAR_24H_20260501_M',2,'2026-05-01','2026-05-01 06:00:00.000','2026-05-01 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.196','2026-05-17 16:49:32.196'),
(5,'TURNO_SERV_PAR_24H_20260501_T',2,'2026-05-01','2026-05-01 14:00:00.000','2026-05-01 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.207','2026-05-17 16:49:32.207'),
(6,'TURNO_SERV_PAR_24H_20260501_N',2,'2026-05-01','2026-05-01 22:00:00.000','2026-05-02 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.217','2026-05-17 16:49:32.217'),
(7,'TURNO_SERV_VET_24H_20260501_M',3,'2026-05-01','2026-05-01 06:00:00.000','2026-05-01 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.228','2026-05-17 16:49:32.228'),
(8,'TURNO_SERV_VET_24H_20260501_T',3,'2026-05-01','2026-05-01 14:00:00.000','2026-05-01 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.239','2026-05-17 16:49:32.239'),
(9,'TURNO_SERV_VET_24H_20260501_N',3,'2026-05-01','2026-05-01 22:00:00.000','2026-05-02 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.250','2026-05-17 16:49:32.250'),
(10,'TURNO_SERV_RE_24H_20260501_M',4,'2026-05-01','2026-05-01 06:00:00.000','2026-05-01 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.261','2026-05-17 16:49:32.261'),
(11,'TURNO_SERV_RE_24H_20260501_T',4,'2026-05-01','2026-05-01 14:00:00.000','2026-05-01 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.271','2026-05-17 16:49:32.271'),
(12,'TURNO_SERV_RE_24H_20260501_N',4,'2026-05-01','2026-05-01 22:00:00.000','2026-05-02 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.281','2026-05-17 16:49:32.281'),
(13,'TURNO_SERV_CECO_24H_20260501_M',5,'2026-05-01','2026-05-01 06:00:00.000','2026-05-01 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.295','2026-05-17 16:49:32.295'),
(14,'TURNO_SERV_CECO_24H_20260501_T',5,'2026-05-01','2026-05-01 14:00:00.000','2026-05-01 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.305','2026-05-17 16:49:32.305'),
(15,'TURNO_SERV_CECO_24H_20260501_N',5,'2026-05-01','2026-05-01 22:00:00.000','2026-05-02 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.315','2026-05-17 16:49:32.315'),
(16,'TURNO_SERV_CECO_JEFE_20260501_D',6,'2026-05-01','2026-05-01 08:00:00.000','2026-05-01 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.325','2026-05-17 16:49:32.325'),
(17,'TURNO_SERV_TER_NOCTURNO_20260501_N',7,'2026-05-01','2026-05-01 22:00:00.000','2026-05-02 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.336','2026-05-17 16:49:32.336'),
(18,'TURNO_SERV_HUE_VARIABLE_20260501_N',8,'2026-05-01','2026-05-01 22:00:00.000','2026-05-02 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.346','2026-05-17 16:49:32.346'),
(19,'TURNO_SERV_SF_24H_20260502_M',1,'2026-05-02','2026-05-02 06:00:00.000','2026-05-02 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.357','2026-05-17 16:49:32.357'),
(20,'TURNO_SERV_SF_24H_20260502_T',1,'2026-05-02','2026-05-02 14:00:00.000','2026-05-02 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.367','2026-05-17 16:49:32.367'),
(21,'TURNO_SERV_SF_24H_20260502_N',1,'2026-05-02','2026-05-02 22:00:00.000','2026-05-03 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.377','2026-05-17 16:49:32.377'),
(22,'TURNO_SERV_PAR_24H_20260502_M',2,'2026-05-02','2026-05-02 06:00:00.000','2026-05-02 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.390','2026-05-17 16:49:32.390'),
(23,'TURNO_SERV_PAR_24H_20260502_T',2,'2026-05-02','2026-05-02 14:00:00.000','2026-05-02 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.401','2026-05-17 16:49:32.401'),
(24,'TURNO_SERV_PAR_24H_20260502_N',2,'2026-05-02','2026-05-02 22:00:00.000','2026-05-03 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.412','2026-05-17 16:49:32.412'),
(25,'TURNO_SERV_VET_24H_20260502_M',3,'2026-05-02','2026-05-02 06:00:00.000','2026-05-02 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.423','2026-05-17 16:49:32.423'),
(26,'TURNO_SERV_VET_24H_20260502_T',3,'2026-05-02','2026-05-02 14:00:00.000','2026-05-02 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.434','2026-05-17 16:49:32.434'),
(27,'TURNO_SERV_VET_24H_20260502_N',3,'2026-05-02','2026-05-02 22:00:00.000','2026-05-03 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.445','2026-05-17 16:49:32.445'),
(28,'TURNO_SERV_RE_24H_20260502_M',4,'2026-05-02','2026-05-02 06:00:00.000','2026-05-02 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.456','2026-05-17 16:49:32.456'),
(29,'TURNO_SERV_RE_24H_20260502_T',4,'2026-05-02','2026-05-02 14:00:00.000','2026-05-02 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.467','2026-05-17 16:49:32.467'),
(30,'TURNO_SERV_RE_24H_20260502_N',4,'2026-05-02','2026-05-02 22:00:00.000','2026-05-03 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.478','2026-05-17 16:49:32.478'),
(31,'TURNO_SERV_CECO_24H_20260502_M',5,'2026-05-02','2026-05-02 06:00:00.000','2026-05-02 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.489','2026-05-17 16:49:32.489'),
(32,'TURNO_SERV_CECO_24H_20260502_T',5,'2026-05-02','2026-05-02 14:00:00.000','2026-05-02 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.499','2026-05-17 16:49:32.499'),
(33,'TURNO_SERV_CECO_24H_20260502_N',5,'2026-05-02','2026-05-02 22:00:00.000','2026-05-03 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.512','2026-05-17 16:49:32.512'),
(34,'TURNO_SERV_TER_NOCTURNO_20260502_N',7,'2026-05-02','2026-05-02 22:00:00.000','2026-05-03 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.522','2026-05-17 16:49:32.522'),
(35,'TURNO_SERV_HUE_VARIABLE_20260502_M',8,'2026-05-02','2026-05-02 06:00:00.000','2026-05-02 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.531','2026-05-17 16:49:32.531'),
(36,'TURNO_SERV_HUE_VARIABLE_20260502_T',8,'2026-05-02','2026-05-02 14:00:00.000','2026-05-02 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.540','2026-05-17 16:49:32.540'),
(37,'TURNO_SERV_HUE_VARIABLE_20260502_N',8,'2026-05-02','2026-05-02 22:00:00.000','2026-05-03 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.550','2026-05-17 16:49:32.550'),
(38,'TURNO_SERV_SF_24H_20260503_M',1,'2026-05-03','2026-05-03 06:00:00.000','2026-05-03 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.560','2026-05-17 16:49:32.560'),
(39,'TURNO_SERV_SF_24H_20260503_T',1,'2026-05-03','2026-05-03 14:00:00.000','2026-05-03 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.570','2026-05-17 16:49:32.570'),
(40,'TURNO_SERV_SF_24H_20260503_N',1,'2026-05-03','2026-05-03 22:00:00.000','2026-05-04 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.580','2026-05-17 16:49:32.580'),
(41,'TURNO_SERV_PAR_24H_20260503_M',2,'2026-05-03','2026-05-03 06:00:00.000','2026-05-03 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.590','2026-05-17 16:49:32.590'),
(42,'TURNO_SERV_PAR_24H_20260503_T',2,'2026-05-03','2026-05-03 14:00:00.000','2026-05-03 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.600','2026-05-17 16:49:32.600'),
(43,'TURNO_SERV_PAR_24H_20260503_N',2,'2026-05-03','2026-05-03 22:00:00.000','2026-05-04 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.615','2026-05-17 16:49:32.615'),
(44,'TURNO_SERV_VET_24H_20260503_M',3,'2026-05-03','2026-05-03 06:00:00.000','2026-05-03 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.625','2026-05-17 16:49:32.625'),
(45,'TURNO_SERV_VET_24H_20260503_T',3,'2026-05-03','2026-05-03 14:00:00.000','2026-05-03 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.636','2026-05-17 16:49:32.636'),
(46,'TURNO_SERV_VET_24H_20260503_N',3,'2026-05-03','2026-05-03 22:00:00.000','2026-05-04 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.646','2026-05-17 16:49:32.646'),
(47,'TURNO_SERV_RE_24H_20260503_M',4,'2026-05-03','2026-05-03 06:00:00.000','2026-05-03 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.657','2026-05-17 16:49:32.657'),
(48,'TURNO_SERV_RE_24H_20260503_T',4,'2026-05-03','2026-05-03 14:00:00.000','2026-05-03 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.671','2026-05-17 16:49:32.671'),
(49,'TURNO_SERV_RE_24H_20260503_N',4,'2026-05-03','2026-05-03 22:00:00.000','2026-05-04 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.681','2026-05-17 16:49:32.681'),
(50,'TURNO_SERV_CECO_24H_20260503_M',5,'2026-05-03','2026-05-03 06:00:00.000','2026-05-03 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.691','2026-05-17 16:49:32.691'),
(51,'TURNO_SERV_CECO_24H_20260503_T',5,'2026-05-03','2026-05-03 14:00:00.000','2026-05-03 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.700','2026-05-17 16:49:32.700'),
(52,'TURNO_SERV_CECO_24H_20260503_N',5,'2026-05-03','2026-05-03 22:00:00.000','2026-05-04 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.710','2026-05-17 16:49:32.710'),
(53,'TURNO_SERV_TER_NOCTURNO_20260503_N',7,'2026-05-03','2026-05-03 22:00:00.000','2026-05-04 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.720','2026-05-17 16:49:32.720'),
(54,'TURNO_SERV_HUE_VARIABLE_20260503_M',8,'2026-05-03','2026-05-03 06:00:00.000','2026-05-03 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.730','2026-05-17 16:49:32.730'),
(55,'TURNO_SERV_HUE_VARIABLE_20260503_T',8,'2026-05-03','2026-05-03 14:00:00.000','2026-05-03 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.740','2026-05-17 16:49:32.740'),
(56,'TURNO_SERV_HUE_VARIABLE_20260503_N',8,'2026-05-03','2026-05-03 22:00:00.000','2026-05-04 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.750','2026-05-17 16:49:32.750'),
(57,'TURNO_SERV_SF_24H_20260504_M',1,'2026-05-04','2026-05-04 06:00:00.000','2026-05-04 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.764','2026-05-17 16:49:32.764'),
(58,'TURNO_SERV_SF_24H_20260504_T',1,'2026-05-04','2026-05-04 14:00:00.000','2026-05-04 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.774','2026-05-17 16:49:32.774'),
(59,'TURNO_SERV_SF_24H_20260504_N',1,'2026-05-04','2026-05-04 22:00:00.000','2026-05-05 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.784','2026-05-17 16:49:32.784'),
(60,'TURNO_SERV_PAR_24H_20260504_M',2,'2026-05-04','2026-05-04 06:00:00.000','2026-05-04 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.794','2026-05-17 16:49:32.794'),
(61,'TURNO_SERV_PAR_24H_20260504_T',2,'2026-05-04','2026-05-04 14:00:00.000','2026-05-04 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.805','2026-05-17 16:49:32.805'),
(62,'TURNO_SERV_PAR_24H_20260504_N',2,'2026-05-04','2026-05-04 22:00:00.000','2026-05-05 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.815','2026-05-17 16:49:32.815'),
(63,'TURNO_SERV_VET_24H_20260504_M',3,'2026-05-04','2026-05-04 06:00:00.000','2026-05-04 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.825','2026-05-17 16:49:32.825'),
(64,'TURNO_SERV_VET_24H_20260504_T',3,'2026-05-04','2026-05-04 14:00:00.000','2026-05-04 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.835','2026-05-17 16:49:32.835'),
(65,'TURNO_SERV_VET_24H_20260504_N',3,'2026-05-04','2026-05-04 22:00:00.000','2026-05-05 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.846','2026-05-17 16:49:32.846'),
(66,'TURNO_SERV_RE_24H_20260504_M',4,'2026-05-04','2026-05-04 06:00:00.000','2026-05-04 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.857','2026-05-17 16:49:32.857'),
(67,'TURNO_SERV_RE_24H_20260504_T',4,'2026-05-04','2026-05-04 14:00:00.000','2026-05-04 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.868','2026-05-17 16:49:32.868'),
(68,'TURNO_SERV_RE_24H_20260504_N',4,'2026-05-04','2026-05-04 22:00:00.000','2026-05-05 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.883','2026-05-17 16:49:32.883'),
(69,'TURNO_SERV_CECO_24H_20260504_M',5,'2026-05-04','2026-05-04 06:00:00.000','2026-05-04 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.893','2026-05-17 16:49:32.893'),
(70,'TURNO_SERV_CECO_24H_20260504_T',5,'2026-05-04','2026-05-04 14:00:00.000','2026-05-04 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.904','2026-05-17 16:49:32.904'),
(71,'TURNO_SERV_CECO_24H_20260504_N',5,'2026-05-04','2026-05-04 22:00:00.000','2026-05-05 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.915','2026-05-17 16:49:32.915'),
(72,'TURNO_SERV_CECO_JEFE_20260504_D',6,'2026-05-04','2026-05-04 08:00:00.000','2026-05-04 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.925','2026-05-17 16:49:32.925'),
(73,'TURNO_SERV_TER_NOCTURNO_20260504_N',7,'2026-05-04','2026-05-04 22:00:00.000','2026-05-05 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.935','2026-05-17 16:49:32.935'),
(74,'TURNO_SERV_HUE_VARIABLE_20260504_N',8,'2026-05-04','2026-05-04 22:00:00.000','2026-05-05 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.945','2026-05-17 16:49:32.945'),
(75,'TURNO_SERV_SF_24H_20260505_M',1,'2026-05-05','2026-05-05 06:00:00.000','2026-05-05 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.955','2026-05-17 16:49:32.955'),
(76,'TURNO_SERV_SF_24H_20260505_T',1,'2026-05-05','2026-05-05 14:00:00.000','2026-05-05 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.965','2026-05-17 16:49:32.965'),
(77,'TURNO_SERV_SF_24H_20260505_N',1,'2026-05-05','2026-05-05 22:00:00.000','2026-05-06 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:32.975','2026-05-17 16:49:32.975'),
(78,'TURNO_SERV_PAR_24H_20260505_M',2,'2026-05-05','2026-05-05 06:00:00.000','2026-05-05 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.988','2026-05-17 16:49:32.988'),
(79,'TURNO_SERV_PAR_24H_20260505_T',2,'2026-05-05','2026-05-05 14:00:00.000','2026-05-05 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:32.999','2026-05-17 16:49:32.999'),
(80,'TURNO_SERV_PAR_24H_20260505_N',2,'2026-05-05','2026-05-05 22:00:00.000','2026-05-06 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.009','2026-05-17 16:49:33.009'),
(81,'TURNO_SERV_VET_24H_20260505_M',3,'2026-05-05','2026-05-05 06:00:00.000','2026-05-05 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.019','2026-05-17 16:49:33.019'),
(82,'TURNO_SERV_VET_24H_20260505_T',3,'2026-05-05','2026-05-05 14:00:00.000','2026-05-05 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.029','2026-05-17 16:49:33.029'),
(83,'TURNO_SERV_VET_24H_20260505_N',3,'2026-05-05','2026-05-05 22:00:00.000','2026-05-06 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.040','2026-05-17 16:49:33.040'),
(84,'TURNO_SERV_RE_24H_20260505_M',4,'2026-05-05','2026-05-05 06:00:00.000','2026-05-05 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.051','2026-05-17 16:49:33.051'),
(85,'TURNO_SERV_RE_24H_20260505_T',4,'2026-05-05','2026-05-05 14:00:00.000','2026-05-05 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.062','2026-05-17 16:49:33.062'),
(86,'TURNO_SERV_RE_24H_20260505_N',4,'2026-05-05','2026-05-05 22:00:00.000','2026-05-06 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.072','2026-05-17 16:49:33.072'),
(87,'TURNO_SERV_CECO_24H_20260505_M',5,'2026-05-05','2026-05-05 06:00:00.000','2026-05-05 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.083','2026-05-17 16:49:33.083'),
(88,'TURNO_SERV_CECO_24H_20260505_T',5,'2026-05-05','2026-05-05 14:00:00.000','2026-05-05 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.097','2026-05-17 16:49:33.097'),
(89,'TURNO_SERV_CECO_24H_20260505_N',5,'2026-05-05','2026-05-05 22:00:00.000','2026-05-06 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.108','2026-05-17 16:49:33.108'),
(90,'TURNO_SERV_CECO_JEFE_20260505_D',6,'2026-05-05','2026-05-05 08:00:00.000','2026-05-05 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.119','2026-05-17 16:49:33.119'),
(91,'TURNO_SERV_TER_NOCTURNO_20260505_N',7,'2026-05-05','2026-05-05 22:00:00.000','2026-05-06 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.130','2026-05-17 16:49:33.130'),
(92,'TURNO_SERV_HUE_VARIABLE_20260505_N',8,'2026-05-05','2026-05-05 22:00:00.000','2026-05-06 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.140','2026-05-17 16:49:33.140'),
(93,'TURNO_SERV_SF_24H_20260506_M',1,'2026-05-06','2026-05-06 06:00:00.000','2026-05-06 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.150','2026-05-17 16:49:33.150'),
(94,'TURNO_SERV_SF_24H_20260506_T',1,'2026-05-06','2026-05-06 14:00:00.000','2026-05-06 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.160','2026-05-17 16:49:33.160'),
(95,'TURNO_SERV_SF_24H_20260506_N',1,'2026-05-06','2026-05-06 22:00:00.000','2026-05-07 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.170','2026-05-17 16:49:33.170'),
(96,'TURNO_SERV_PAR_24H_20260506_M',2,'2026-05-06','2026-05-06 06:00:00.000','2026-05-06 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.180','2026-05-17 16:49:33.180'),
(97,'TURNO_SERV_PAR_24H_20260506_T',2,'2026-05-06','2026-05-06 14:00:00.000','2026-05-06 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.190','2026-05-17 16:49:33.190'),
(98,'TURNO_SERV_PAR_24H_20260506_N',2,'2026-05-06','2026-05-06 22:00:00.000','2026-05-07 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.204','2026-05-17 16:49:33.204'),
(99,'TURNO_SERV_VET_24H_20260506_M',3,'2026-05-06','2026-05-06 06:00:00.000','2026-05-06 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.214','2026-05-17 16:49:33.214'),
(100,'TURNO_SERV_VET_24H_20260506_T',3,'2026-05-06','2026-05-06 14:00:00.000','2026-05-06 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.224','2026-05-17 16:49:33.224'),
(101,'TURNO_SERV_VET_24H_20260506_N',3,'2026-05-06','2026-05-06 22:00:00.000','2026-05-07 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.235','2026-05-17 16:49:33.235'),
(102,'TURNO_SERV_RE_24H_20260506_M',4,'2026-05-06','2026-05-06 06:00:00.000','2026-05-06 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.245','2026-05-17 16:49:33.245'),
(103,'TURNO_SERV_RE_24H_20260506_T',4,'2026-05-06','2026-05-06 14:00:00.000','2026-05-06 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.256','2026-05-17 16:49:33.256'),
(104,'TURNO_SERV_RE_24H_20260506_N',4,'2026-05-06','2026-05-06 22:00:00.000','2026-05-07 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.266','2026-05-17 16:49:33.266'),
(105,'TURNO_SERV_CECO_24H_20260506_M',5,'2026-05-06','2026-05-06 06:00:00.000','2026-05-06 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.276','2026-05-17 16:49:33.276'),
(106,'TURNO_SERV_CECO_24H_20260506_T',5,'2026-05-06','2026-05-06 14:00:00.000','2026-05-06 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.286','2026-05-17 16:49:33.286'),
(107,'TURNO_SERV_CECO_24H_20260506_N',5,'2026-05-06','2026-05-06 22:00:00.000','2026-05-07 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.297','2026-05-17 16:49:33.297'),
(108,'TURNO_SERV_CECO_JEFE_20260506_D',6,'2026-05-06','2026-05-06 08:00:00.000','2026-05-06 16:00:00.000','SIN_CUBRIR',1,'2026-05-17 16:49:33.311','2026-05-17 16:49:33.311'),
(109,'TURNO_SERV_TER_NOCTURNO_20260506_N',7,'2026-05-06','2026-05-06 22:00:00.000','2026-05-07 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.322','2026-05-17 16:49:33.322'),
(110,'TURNO_SERV_HUE_VARIABLE_20260506_N',8,'2026-05-06','2026-05-06 22:00:00.000','2026-05-07 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.333','2026-05-17 16:49:33.333'),
(111,'TURNO_SERV_SF_24H_20260507_M',1,'2026-05-07','2026-05-07 06:00:00.000','2026-05-07 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.343','2026-05-17 16:49:33.343'),
(112,'TURNO_SERV_SF_24H_20260507_T',1,'2026-05-07','2026-05-07 14:00:00.000','2026-05-07 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.353','2026-05-17 16:49:33.353'),
(113,'TURNO_SERV_SF_24H_20260507_N',1,'2026-05-07','2026-05-07 22:00:00.000','2026-05-08 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.363','2026-05-17 16:49:33.363'),
(114,'TURNO_SERV_PAR_24H_20260507_M',2,'2026-05-07','2026-05-07 06:00:00.000','2026-05-07 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.373','2026-05-17 16:49:33.373'),
(115,'TURNO_SERV_PAR_24H_20260507_T',2,'2026-05-07','2026-05-07 14:00:00.000','2026-05-07 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.382','2026-05-17 16:49:33.382'),
(116,'TURNO_SERV_PAR_24H_20260507_N',2,'2026-05-07','2026-05-07 22:00:00.000','2026-05-08 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.392','2026-05-17 16:49:33.392'),
(117,'TURNO_SERV_VET_24H_20260507_M',3,'2026-05-07','2026-05-07 06:00:00.000','2026-05-07 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.402','2026-05-17 16:49:33.402'),
(118,'TURNO_SERV_VET_24H_20260507_T',3,'2026-05-07','2026-05-07 14:00:00.000','2026-05-07 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.415','2026-05-17 16:49:33.415'),
(119,'TURNO_SERV_VET_24H_20260507_N',3,'2026-05-07','2026-05-07 22:00:00.000','2026-05-08 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.425','2026-05-17 16:49:33.425'),
(120,'TURNO_SERV_RE_24H_20260507_M',4,'2026-05-07','2026-05-07 06:00:00.000','2026-05-07 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.435','2026-05-17 16:49:33.435'),
(121,'TURNO_SERV_RE_24H_20260507_T',4,'2026-05-07','2026-05-07 14:00:00.000','2026-05-07 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.445','2026-05-17 16:49:33.445'),
(122,'TURNO_SERV_RE_24H_20260507_N',4,'2026-05-07','2026-05-07 22:00:00.000','2026-05-08 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.455','2026-05-17 16:49:33.455'),
(123,'TURNO_SERV_CECO_24H_20260507_M',5,'2026-05-07','2026-05-07 06:00:00.000','2026-05-07 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.467','2026-05-17 16:49:33.467'),
(124,'TURNO_SERV_CECO_24H_20260507_T',5,'2026-05-07','2026-05-07 14:00:00.000','2026-05-07 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.477','2026-05-17 16:49:33.477'),
(125,'TURNO_SERV_CECO_24H_20260507_N',5,'2026-05-07','2026-05-07 22:00:00.000','2026-05-08 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.488','2026-05-17 16:49:33.488'),
(126,'TURNO_SERV_CECO_JEFE_20260507_D',6,'2026-05-07','2026-05-07 08:00:00.000','2026-05-07 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.499','2026-05-17 16:49:33.499'),
(127,'TURNO_SERV_TER_NOCTURNO_20260507_N',7,'2026-05-07','2026-05-07 22:00:00.000','2026-05-08 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.510','2026-05-17 16:49:33.510'),
(128,'TURNO_SERV_HUE_VARIABLE_20260507_N',8,'2026-05-07','2026-05-07 22:00:00.000','2026-05-08 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.524','2026-05-17 16:49:33.524'),
(129,'TURNO_SERV_SF_24H_20260508_M',1,'2026-05-08','2026-05-08 06:00:00.000','2026-05-08 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.535','2026-05-17 16:49:33.535'),
(130,'TURNO_SERV_SF_24H_20260508_T',1,'2026-05-08','2026-05-08 14:00:00.000','2026-05-08 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.546','2026-05-17 16:49:33.546'),
(131,'TURNO_SERV_SF_24H_20260508_N',1,'2026-05-08','2026-05-08 22:00:00.000','2026-05-09 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.556','2026-05-17 16:49:33.556'),
(132,'TURNO_SERV_PAR_24H_20260508_M',2,'2026-05-08','2026-05-08 06:00:00.000','2026-05-08 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.566','2026-05-17 16:49:33.566'),
(133,'TURNO_SERV_PAR_24H_20260508_T',2,'2026-05-08','2026-05-08 14:00:00.000','2026-05-08 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.576','2026-05-17 16:49:33.576'),
(134,'TURNO_SERV_PAR_24H_20260508_N',2,'2026-05-08','2026-05-08 22:00:00.000','2026-05-09 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.586','2026-05-17 16:49:33.586'),
(135,'TURNO_SERV_VET_24H_20260508_M',3,'2026-05-08','2026-05-08 06:00:00.000','2026-05-08 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.596','2026-05-17 16:49:33.596'),
(136,'TURNO_SERV_VET_24H_20260508_T',3,'2026-05-08','2026-05-08 14:00:00.000','2026-05-08 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.606','2026-05-17 16:49:33.606'),
(137,'TURNO_SERV_VET_24H_20260508_N',3,'2026-05-08','2026-05-08 22:00:00.000','2026-05-09 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.617','2026-05-17 16:49:33.617'),
(138,'TURNO_SERV_RE_24H_20260508_M',4,'2026-05-08','2026-05-08 06:00:00.000','2026-05-08 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.627','2026-05-17 16:49:33.627'),
(139,'TURNO_SERV_RE_24H_20260508_T',4,'2026-05-08','2026-05-08 14:00:00.000','2026-05-08 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.641','2026-05-17 16:49:33.641'),
(140,'TURNO_SERV_RE_24H_20260508_N',4,'2026-05-08','2026-05-08 22:00:00.000','2026-05-09 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.652','2026-05-17 16:49:33.652'),
(141,'TURNO_SERV_CECO_24H_20260508_M',5,'2026-05-08','2026-05-08 06:00:00.000','2026-05-08 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.666','2026-05-17 16:49:33.666'),
(142,'TURNO_SERV_CECO_24H_20260508_T',5,'2026-05-08','2026-05-08 14:00:00.000','2026-05-08 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.677','2026-05-17 16:49:33.677'),
(143,'TURNO_SERV_CECO_24H_20260508_N',5,'2026-05-08','2026-05-08 22:00:00.000','2026-05-09 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.691','2026-05-17 16:49:33.691'),
(144,'TURNO_SERV_CECO_JEFE_20260508_D',6,'2026-05-08','2026-05-08 08:00:00.000','2026-05-08 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.702','2026-05-17 16:49:33.702'),
(145,'TURNO_SERV_TER_NOCTURNO_20260508_N',7,'2026-05-08','2026-05-08 22:00:00.000','2026-05-09 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.713','2026-05-17 16:49:33.713'),
(146,'TURNO_SERV_HUE_VARIABLE_20260508_N',8,'2026-05-08','2026-05-08 22:00:00.000','2026-05-09 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.724','2026-05-17 16:49:33.724'),
(147,'TURNO_SERV_SF_24H_20260509_M',1,'2026-05-09','2026-05-09 06:00:00.000','2026-05-09 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.735','2026-05-17 16:49:33.735'),
(148,'TURNO_SERV_SF_24H_20260509_T',1,'2026-05-09','2026-05-09 14:00:00.000','2026-05-09 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.746','2026-05-17 16:49:33.746'),
(149,'TURNO_SERV_SF_24H_20260509_N',1,'2026-05-09','2026-05-09 22:00:00.000','2026-05-10 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.756','2026-05-17 16:49:33.756'),
(150,'TURNO_SERV_PAR_24H_20260509_M',2,'2026-05-09','2026-05-09 06:00:00.000','2026-05-09 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.766','2026-05-17 16:49:33.766'),
(151,'TURNO_SERV_PAR_24H_20260509_T',2,'2026-05-09','2026-05-09 14:00:00.000','2026-05-09 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.776','2026-05-17 16:49:33.776'),
(152,'TURNO_SERV_PAR_24H_20260509_N',2,'2026-05-09','2026-05-09 22:00:00.000','2026-05-10 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.786','2026-05-17 16:49:33.786'),
(153,'TURNO_SERV_VET_24H_20260509_M',3,'2026-05-09','2026-05-09 06:00:00.000','2026-05-09 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.799','2026-05-17 16:49:33.799'),
(154,'TURNO_SERV_VET_24H_20260509_T',3,'2026-05-09','2026-05-09 14:00:00.000','2026-05-09 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.810','2026-05-17 16:49:33.810'),
(155,'TURNO_SERV_VET_24H_20260509_N',3,'2026-05-09','2026-05-09 22:00:00.000','2026-05-10 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.820','2026-05-17 16:49:33.820'),
(156,'TURNO_SERV_RE_24H_20260509_M',4,'2026-05-09','2026-05-09 06:00:00.000','2026-05-09 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.830','2026-05-17 16:49:33.830'),
(157,'TURNO_SERV_RE_24H_20260509_T',4,'2026-05-09','2026-05-09 14:00:00.000','2026-05-09 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.841','2026-05-17 16:49:33.841'),
(158,'TURNO_SERV_RE_24H_20260509_N',4,'2026-05-09','2026-05-09 22:00:00.000','2026-05-10 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.852','2026-05-17 16:49:33.852'),
(159,'TURNO_SERV_CECO_24H_20260509_M',5,'2026-05-09','2026-05-09 06:00:00.000','2026-05-09 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.863','2026-05-17 16:49:33.863'),
(160,'TURNO_SERV_CECO_24H_20260509_T',5,'2026-05-09','2026-05-09 14:00:00.000','2026-05-09 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.874','2026-05-17 16:49:33.874'),
(161,'TURNO_SERV_CECO_24H_20260509_N',5,'2026-05-09','2026-05-09 22:00:00.000','2026-05-10 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.885','2026-05-17 16:49:33.885'),
(162,'TURNO_SERV_TER_NOCTURNO_20260509_N',7,'2026-05-09','2026-05-09 22:00:00.000','2026-05-10 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.896','2026-05-17 16:49:33.896'),
(163,'TURNO_SERV_HUE_VARIABLE_20260509_M',8,'2026-05-09','2026-05-09 06:00:00.000','2026-05-09 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.906','2026-05-17 16:49:33.906'),
(164,'TURNO_SERV_HUE_VARIABLE_20260509_T',8,'2026-05-09','2026-05-09 14:00:00.000','2026-05-09 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.921','2026-05-17 16:49:33.921'),
(165,'TURNO_SERV_HUE_VARIABLE_20260509_N',8,'2026-05-09','2026-05-09 22:00:00.000','2026-05-10 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.942','2026-05-17 16:49:33.942'),
(166,'TURNO_SERV_SF_24H_20260510_M',1,'2026-05-10','2026-05-10 06:00:00.000','2026-05-10 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.953','2026-05-17 16:49:33.953'),
(167,'TURNO_SERV_SF_24H_20260510_T',1,'2026-05-10','2026-05-10 14:00:00.000','2026-05-10 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.963','2026-05-17 16:49:33.963'),
(168,'TURNO_SERV_SF_24H_20260510_N',1,'2026-05-10','2026-05-10 22:00:00.000','2026-05-11 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:33.976','2026-05-17 16:49:33.976'),
(169,'TURNO_SERV_PAR_24H_20260510_M',2,'2026-05-10','2026-05-10 06:00:00.000','2026-05-10 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.986','2026-05-17 16:49:33.986'),
(170,'TURNO_SERV_PAR_24H_20260510_T',2,'2026-05-10','2026-05-10 14:00:00.000','2026-05-10 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:33.996','2026-05-17 16:49:33.996'),
(171,'TURNO_SERV_PAR_24H_20260510_N',2,'2026-05-10','2026-05-10 22:00:00.000','2026-05-11 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.006','2026-05-17 16:49:34.006'),
(172,'TURNO_SERV_VET_24H_20260510_M',3,'2026-05-10','2026-05-10 06:00:00.000','2026-05-10 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.016','2026-05-17 16:49:34.016'),
(173,'TURNO_SERV_VET_24H_20260510_T',3,'2026-05-10','2026-05-10 14:00:00.000','2026-05-10 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.026','2026-05-17 16:49:34.026'),
(174,'TURNO_SERV_VET_24H_20260510_N',3,'2026-05-10','2026-05-10 22:00:00.000','2026-05-11 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.037','2026-05-17 16:49:34.037'),
(175,'TURNO_SERV_RE_24H_20260510_M',4,'2026-05-10','2026-05-10 06:00:00.000','2026-05-10 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.047','2026-05-17 16:49:34.047'),
(176,'TURNO_SERV_RE_24H_20260510_T',4,'2026-05-10','2026-05-10 14:00:00.000','2026-05-10 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.057','2026-05-17 16:49:34.057'),
(177,'TURNO_SERV_RE_24H_20260510_N',4,'2026-05-10','2026-05-10 22:00:00.000','2026-05-11 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.068','2026-05-17 16:49:34.068'),
(178,'TURNO_SERV_CECO_24H_20260510_M',5,'2026-05-10','2026-05-10 06:00:00.000','2026-05-10 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.083','2026-05-17 16:49:34.083'),
(179,'TURNO_SERV_CECO_24H_20260510_T',5,'2026-05-10','2026-05-10 14:00:00.000','2026-05-10 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.094','2026-05-17 16:49:34.094'),
(180,'TURNO_SERV_CECO_24H_20260510_N',5,'2026-05-10','2026-05-10 22:00:00.000','2026-05-11 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.104','2026-05-17 16:49:34.104'),
(181,'TURNO_SERV_TER_NOCTURNO_20260510_N',7,'2026-05-10','2026-05-10 22:00:00.000','2026-05-11 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.115','2026-05-17 16:49:34.115'),
(182,'TURNO_SERV_HUE_VARIABLE_20260510_M',8,'2026-05-10','2026-05-10 06:00:00.000','2026-05-10 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.126','2026-05-17 16:49:34.126'),
(183,'TURNO_SERV_HUE_VARIABLE_20260510_T',8,'2026-05-10','2026-05-10 14:00:00.000','2026-05-10 22:00:00.000','SIN_CUBRIR',1,'2026-05-17 16:49:34.137','2026-05-17 16:49:34.137'),
(184,'TURNO_SERV_HUE_VARIABLE_20260510_N',8,'2026-05-10','2026-05-10 22:00:00.000','2026-05-11 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.148','2026-05-17 16:49:34.148'),
(185,'TURNO_SERV_SF_24H_20260511_M',1,'2026-05-11','2026-05-11 06:00:00.000','2026-05-11 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.158','2026-05-17 16:49:34.158'),
(186,'TURNO_SERV_SF_24H_20260511_T',1,'2026-05-11','2026-05-11 14:00:00.000','2026-05-11 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.168','2026-05-17 16:49:34.168'),
(187,'TURNO_SERV_SF_24H_20260511_N',1,'2026-05-11','2026-05-11 22:00:00.000','2026-05-12 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.178','2026-05-17 16:49:34.178'),
(188,'TURNO_SERV_PAR_24H_20260511_M',2,'2026-05-11','2026-05-11 06:00:00.000','2026-05-11 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.192','2026-05-17 16:49:34.192'),
(189,'TURNO_SERV_PAR_24H_20260511_T',2,'2026-05-11','2026-05-11 14:00:00.000','2026-05-11 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.202','2026-05-17 16:49:34.202'),
(190,'TURNO_SERV_PAR_24H_20260511_N',2,'2026-05-11','2026-05-11 22:00:00.000','2026-05-12 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.212','2026-05-17 16:49:34.212'),
(191,'TURNO_SERV_VET_24H_20260511_M',3,'2026-05-11','2026-05-11 06:00:00.000','2026-05-11 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.223','2026-05-17 16:49:34.223'),
(192,'TURNO_SERV_VET_24H_20260511_T',3,'2026-05-11','2026-05-11 14:00:00.000','2026-05-11 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.234','2026-05-17 16:49:34.234'),
(193,'TURNO_SERV_VET_24H_20260511_N',3,'2026-05-11','2026-05-11 22:00:00.000','2026-05-12 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.245','2026-05-17 16:49:34.245'),
(194,'TURNO_SERV_RE_24H_20260511_M',4,'2026-05-11','2026-05-11 06:00:00.000','2026-05-11 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.256','2026-05-17 16:49:34.256'),
(195,'TURNO_SERV_RE_24H_20260511_T',4,'2026-05-11','2026-05-11 14:00:00.000','2026-05-11 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.267','2026-05-17 16:49:34.267'),
(196,'TURNO_SERV_RE_24H_20260511_N',4,'2026-05-11','2026-05-11 22:00:00.000','2026-05-12 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.277','2026-05-17 16:49:34.277'),
(197,'TURNO_SERV_CECO_24H_20260511_M',5,'2026-05-11','2026-05-11 06:00:00.000','2026-05-11 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.288','2026-05-17 16:49:34.288'),
(198,'TURNO_SERV_CECO_24H_20260511_T',5,'2026-05-11','2026-05-11 14:00:00.000','2026-05-11 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.302','2026-05-17 16:49:34.302'),
(199,'TURNO_SERV_CECO_24H_20260511_N',5,'2026-05-11','2026-05-11 22:00:00.000','2026-05-12 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.313','2026-05-17 16:49:34.313'),
(200,'TURNO_SERV_CECO_JEFE_20260511_D',6,'2026-05-11','2026-05-11 08:00:00.000','2026-05-11 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.324','2026-05-17 16:49:34.324'),
(201,'TURNO_SERV_TER_NOCTURNO_20260511_N',7,'2026-05-11','2026-05-11 22:00:00.000','2026-05-12 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.335','2026-05-17 16:49:34.335'),
(202,'TURNO_SERV_HUE_VARIABLE_20260511_N',8,'2026-05-11','2026-05-11 22:00:00.000','2026-05-12 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.346','2026-05-17 16:49:34.346'),
(203,'TURNO_SERV_SF_24H_20260512_M',1,'2026-05-12','2026-05-12 06:00:00.000','2026-05-12 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.357','2026-05-17 16:49:34.357'),
(204,'TURNO_SERV_SF_24H_20260512_T',1,'2026-05-12','2026-05-12 14:00:00.000','2026-05-12 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.367','2026-05-17 16:49:34.367'),
(205,'TURNO_SERV_SF_24H_20260512_N',1,'2026-05-12','2026-05-12 22:00:00.000','2026-05-13 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.377','2026-05-17 16:49:34.377'),
(206,'TURNO_SERV_PAR_24H_20260512_M',2,'2026-05-12','2026-05-12 06:00:00.000','2026-05-12 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.387','2026-05-17 16:49:34.387'),
(207,'TURNO_SERV_PAR_24H_20260512_T',2,'2026-05-12','2026-05-12 14:00:00.000','2026-05-12 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.396','2026-05-17 16:49:34.396'),
(208,'TURNO_SERV_PAR_24H_20260512_N',2,'2026-05-12','2026-05-12 22:00:00.000','2026-05-13 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.409','2026-05-17 16:49:34.409'),
(209,'TURNO_SERV_VET_24H_20260512_M',3,'2026-05-12','2026-05-12 06:00:00.000','2026-05-12 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.419','2026-05-17 16:49:34.419'),
(210,'TURNO_SERV_VET_24H_20260512_T',3,'2026-05-12','2026-05-12 14:00:00.000','2026-05-12 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.429','2026-05-17 16:49:34.429'),
(211,'TURNO_SERV_VET_24H_20260512_N',3,'2026-05-12','2026-05-12 22:00:00.000','2026-05-13 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.439','2026-05-17 16:49:34.439'),
(212,'TURNO_SERV_RE_24H_20260512_M',4,'2026-05-12','2026-05-12 06:00:00.000','2026-05-12 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.449','2026-05-17 16:49:34.449'),
(213,'TURNO_SERV_RE_24H_20260512_T',4,'2026-05-12','2026-05-12 14:00:00.000','2026-05-12 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.459','2026-05-17 16:49:34.459'),
(214,'TURNO_SERV_RE_24H_20260512_N',4,'2026-05-12','2026-05-12 22:00:00.000','2026-05-13 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.469','2026-05-17 16:49:34.469'),
(215,'TURNO_SERV_CECO_24H_20260512_M',5,'2026-05-12','2026-05-12 06:00:00.000','2026-05-12 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.479','2026-05-17 16:49:34.479'),
(216,'TURNO_SERV_CECO_24H_20260512_T',5,'2026-05-12','2026-05-12 14:00:00.000','2026-05-12 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.489','2026-05-17 16:49:34.489'),
(217,'TURNO_SERV_CECO_24H_20260512_N',5,'2026-05-12','2026-05-12 22:00:00.000','2026-05-13 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.500','2026-05-17 16:49:34.500'),
(218,'TURNO_SERV_CECO_JEFE_20260512_D',6,'2026-05-12','2026-05-12 08:00:00.000','2026-05-12 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.514','2026-05-17 16:49:34.514'),
(219,'TURNO_SERV_TER_NOCTURNO_20260512_N',7,'2026-05-12','2026-05-12 22:00:00.000','2026-05-13 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.524','2026-05-17 16:49:34.524'),
(220,'TURNO_SERV_HUE_VARIABLE_20260512_N',8,'2026-05-12','2026-05-12 22:00:00.000','2026-05-13 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.535','2026-05-17 16:49:34.535'),
(221,'TURNO_SERV_SF_24H_20260513_M',1,'2026-05-13','2026-05-13 06:00:00.000','2026-05-13 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.546','2026-05-17 16:49:34.546'),
(222,'TURNO_SERV_SF_24H_20260513_T',1,'2026-05-13','2026-05-13 14:00:00.000','2026-05-13 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.557','2026-05-17 16:49:34.557'),
(223,'TURNO_SERV_SF_24H_20260513_N',1,'2026-05-13','2026-05-13 22:00:00.000','2026-05-14 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.568','2026-05-17 16:49:34.568'),
(224,'TURNO_SERV_PAR_24H_20260513_M',2,'2026-05-13','2026-05-13 06:00:00.000','2026-05-13 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.578','2026-05-17 16:49:34.578'),
(225,'TURNO_SERV_PAR_24H_20260513_T',2,'2026-05-13','2026-05-13 14:00:00.000','2026-05-13 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.589','2026-05-17 16:49:34.589'),
(226,'TURNO_SERV_PAR_24H_20260513_N',2,'2026-05-13','2026-05-13 22:00:00.000','2026-05-14 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.599','2026-05-17 16:49:34.599'),
(227,'TURNO_SERV_VET_24H_20260513_M',3,'2026-05-13','2026-05-13 06:00:00.000','2026-05-13 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.609','2026-05-17 16:49:34.609'),
(228,'TURNO_SERV_VET_24H_20260513_T',3,'2026-05-13','2026-05-13 14:00:00.000','2026-05-13 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.622','2026-05-17 16:49:34.622'),
(229,'TURNO_SERV_VET_24H_20260513_N',3,'2026-05-13','2026-05-13 22:00:00.000','2026-05-14 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.632','2026-05-17 16:49:34.632'),
(230,'TURNO_SERV_RE_24H_20260513_M',4,'2026-05-13','2026-05-13 06:00:00.000','2026-05-13 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.642','2026-05-17 16:49:34.642'),
(231,'TURNO_SERV_RE_24H_20260513_T',4,'2026-05-13','2026-05-13 14:00:00.000','2026-05-13 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.652','2026-05-17 16:49:34.652'),
(232,'TURNO_SERV_RE_24H_20260513_N',4,'2026-05-13','2026-05-13 22:00:00.000','2026-05-14 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.662','2026-05-17 16:49:34.662'),
(233,'TURNO_SERV_CECO_24H_20260513_M',5,'2026-05-13','2026-05-13 06:00:00.000','2026-05-13 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.676','2026-05-17 16:49:34.676'),
(234,'TURNO_SERV_CECO_24H_20260513_T',5,'2026-05-13','2026-05-13 14:00:00.000','2026-05-13 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.687','2026-05-17 16:49:34.687'),
(235,'TURNO_SERV_CECO_24H_20260513_N',5,'2026-05-13','2026-05-13 22:00:00.000','2026-05-14 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.698','2026-05-17 16:49:34.698'),
(236,'TURNO_SERV_CECO_JEFE_20260513_D',6,'2026-05-13','2026-05-13 08:00:00.000','2026-05-13 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.709','2026-05-17 16:49:34.709'),
(237,'TURNO_SERV_TER_NOCTURNO_20260513_N',7,'2026-05-13','2026-05-13 22:00:00.000','2026-05-14 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.720','2026-05-17 16:49:34.720'),
(238,'TURNO_SERV_HUE_VARIABLE_20260513_N',8,'2026-05-13','2026-05-13 22:00:00.000','2026-05-14 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.730','2026-05-17 16:49:34.730'),
(239,'TURNO_SERV_SF_24H_20260514_M',1,'2026-05-14','2026-05-14 06:00:00.000','2026-05-14 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.741','2026-05-17 16:49:34.741'),
(240,'TURNO_SERV_SF_24H_20260514_T',1,'2026-05-14','2026-05-14 14:00:00.000','2026-05-14 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.752','2026-05-17 16:49:34.752'),
(241,'TURNO_SERV_SF_24H_20260514_N',1,'2026-05-14','2026-05-14 22:00:00.000','2026-05-15 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.762','2026-05-17 16:49:34.762'),
(242,'TURNO_SERV_PAR_24H_20260514_M',2,'2026-05-14','2026-05-14 06:00:00.000','2026-05-14 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.777','2026-05-17 16:49:34.777'),
(243,'TURNO_SERV_PAR_24H_20260514_T',2,'2026-05-14','2026-05-14 14:00:00.000','2026-05-14 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.787','2026-05-17 16:49:34.787'),
(244,'TURNO_SERV_PAR_24H_20260514_N',2,'2026-05-14','2026-05-14 22:00:00.000','2026-05-15 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.797','2026-05-17 16:49:34.797'),
(245,'TURNO_SERV_VET_24H_20260514_M',3,'2026-05-14','2026-05-14 06:00:00.000','2026-05-14 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.807','2026-05-17 16:49:34.807'),
(246,'TURNO_SERV_VET_24H_20260514_T',3,'2026-05-14','2026-05-14 14:00:00.000','2026-05-14 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.824','2026-05-17 16:49:34.824'),
(247,'TURNO_SERV_VET_24H_20260514_N',3,'2026-05-14','2026-05-14 22:00:00.000','2026-05-15 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.834','2026-05-17 16:49:34.834'),
(248,'TURNO_SERV_RE_24H_20260514_M',4,'2026-05-14','2026-05-14 06:00:00.000','2026-05-14 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.844','2026-05-17 16:49:34.844'),
(249,'TURNO_SERV_RE_24H_20260514_T',4,'2026-05-14','2026-05-14 14:00:00.000','2026-05-14 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.855','2026-05-17 16:49:34.855'),
(250,'TURNO_SERV_RE_24H_20260514_N',4,'2026-05-14','2026-05-14 22:00:00.000','2026-05-15 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.866','2026-05-17 16:49:34.866'),
(251,'TURNO_SERV_CECO_24H_20260514_M',5,'2026-05-14','2026-05-14 06:00:00.000','2026-05-14 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.877','2026-05-17 16:49:34.877'),
(252,'TURNO_SERV_CECO_24H_20260514_T',5,'2026-05-14','2026-05-14 14:00:00.000','2026-05-14 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.891','2026-05-17 16:49:34.891'),
(253,'TURNO_SERV_CECO_24H_20260514_N',5,'2026-05-14','2026-05-14 22:00:00.000','2026-05-15 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.902','2026-05-17 16:49:34.902'),
(254,'TURNO_SERV_CECO_JEFE_20260514_D',6,'2026-05-14','2026-05-14 08:00:00.000','2026-05-14 16:00:00.000','SIN_CUBRIR',1,'2026-05-17 16:49:34.913','2026-05-17 16:49:34.913'),
(255,'TURNO_SERV_TER_NOCTURNO_20260514_N',7,'2026-05-14','2026-05-14 22:00:00.000','2026-05-15 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.923','2026-05-17 16:49:34.923'),
(256,'TURNO_SERV_HUE_VARIABLE_20260514_N',8,'2026-05-14','2026-05-14 22:00:00.000','2026-05-15 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.935','2026-05-17 16:49:34.935'),
(257,'TURNO_SERV_SF_24H_20260515_M',1,'2026-05-15','2026-05-15 06:00:00.000','2026-05-15 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.945','2026-05-17 16:49:34.945'),
(258,'TURNO_SERV_SF_24H_20260515_T',1,'2026-05-15','2026-05-15 14:00:00.000','2026-05-15 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.955','2026-05-17 16:49:34.955'),
(259,'TURNO_SERV_SF_24H_20260515_N',1,'2026-05-15','2026-05-15 22:00:00.000','2026-05-16 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:34.965','2026-05-17 16:49:34.965'),
(260,'TURNO_SERV_PAR_24H_20260515_M',2,'2026-05-15','2026-05-15 06:00:00.000','2026-05-15 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.975','2026-05-17 16:49:34.975'),
(261,'TURNO_SERV_PAR_24H_20260515_T',2,'2026-05-15','2026-05-15 14:00:00.000','2026-05-15 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.985','2026-05-17 16:49:34.985'),
(262,'TURNO_SERV_PAR_24H_20260515_N',2,'2026-05-15','2026-05-15 22:00:00.000','2026-05-16 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:34.999','2026-05-17 16:49:34.999'),
(263,'TURNO_SERV_VET_24H_20260515_M',3,'2026-05-15','2026-05-15 06:00:00.000','2026-05-15 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.009','2026-05-17 16:49:35.009'),
(264,'TURNO_SERV_VET_24H_20260515_T',3,'2026-05-15','2026-05-15 14:00:00.000','2026-05-15 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.019','2026-05-17 16:49:35.019'),
(265,'TURNO_SERV_VET_24H_20260515_N',3,'2026-05-15','2026-05-15 22:00:00.000','2026-05-16 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.029','2026-05-17 16:49:35.029'),
(266,'TURNO_SERV_RE_24H_20260515_M',4,'2026-05-15','2026-05-15 06:00:00.000','2026-05-15 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.039','2026-05-17 16:49:35.039'),
(267,'TURNO_SERV_RE_24H_20260515_T',4,'2026-05-15','2026-05-15 14:00:00.000','2026-05-15 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.049','2026-05-17 16:49:35.049'),
(268,'TURNO_SERV_RE_24H_20260515_N',4,'2026-05-15','2026-05-15 22:00:00.000','2026-05-16 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.059','2026-05-17 16:49:35.059'),
(269,'TURNO_SERV_CECO_24H_20260515_M',5,'2026-05-15','2026-05-15 06:00:00.000','2026-05-15 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.069','2026-05-17 16:49:35.069'),
(270,'TURNO_SERV_CECO_24H_20260515_T',5,'2026-05-15','2026-05-15 14:00:00.000','2026-05-15 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.079','2026-05-17 16:49:35.079'),
(271,'TURNO_SERV_CECO_24H_20260515_N',5,'2026-05-15','2026-05-15 22:00:00.000','2026-05-16 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.089','2026-05-17 16:49:35.089'),
(272,'TURNO_SERV_CECO_JEFE_20260515_D',6,'2026-05-15','2026-05-15 08:00:00.000','2026-05-15 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.099','2026-05-17 16:49:35.099'),
(273,'TURNO_SERV_TER_NOCTURNO_20260515_N',7,'2026-05-15','2026-05-15 22:00:00.000','2026-05-16 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.114','2026-05-17 16:49:35.114'),
(274,'TURNO_SERV_HUE_VARIABLE_20260515_N',8,'2026-05-15','2026-05-15 22:00:00.000','2026-05-16 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.124','2026-05-17 16:49:35.124'),
(275,'TURNO_SERV_SF_24H_20260516_M',1,'2026-05-16','2026-05-16 06:00:00.000','2026-05-16 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.134','2026-05-17 16:49:35.134'),
(276,'TURNO_SERV_SF_24H_20260516_T',1,'2026-05-16','2026-05-16 14:00:00.000','2026-05-16 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.144','2026-05-17 16:49:35.144'),
(277,'TURNO_SERV_SF_24H_20260516_N',1,'2026-05-16','2026-05-16 22:00:00.000','2026-05-17 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.156','2026-05-17 16:49:35.156'),
(278,'TURNO_SERV_PAR_24H_20260516_M',2,'2026-05-16','2026-05-16 06:00:00.000','2026-05-16 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.166','2026-05-17 16:49:35.166'),
(279,'TURNO_SERV_PAR_24H_20260516_T',2,'2026-05-16','2026-05-16 14:00:00.000','2026-05-16 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.178','2026-05-17 16:49:35.178'),
(280,'TURNO_SERV_PAR_24H_20260516_N',2,'2026-05-16','2026-05-16 22:00:00.000','2026-05-17 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.189','2026-05-17 16:49:35.189'),
(281,'TURNO_SERV_VET_24H_20260516_M',3,'2026-05-16','2026-05-16 06:00:00.000','2026-05-16 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.199','2026-05-17 16:49:35.199'),
(282,'TURNO_SERV_VET_24H_20260516_T',3,'2026-05-16','2026-05-16 14:00:00.000','2026-05-16 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.209','2026-05-17 16:49:35.209'),
(283,'TURNO_SERV_VET_24H_20260516_N',3,'2026-05-16','2026-05-16 22:00:00.000','2026-05-17 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.224','2026-05-17 16:49:35.224'),
(284,'TURNO_SERV_RE_24H_20260516_M',4,'2026-05-16','2026-05-16 06:00:00.000','2026-05-16 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.234','2026-05-17 16:49:35.234'),
(285,'TURNO_SERV_RE_24H_20260516_T',4,'2026-05-16','2026-05-16 14:00:00.000','2026-05-16 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.244','2026-05-17 16:49:35.244'),
(286,'TURNO_SERV_RE_24H_20260516_N',4,'2026-05-16','2026-05-16 22:00:00.000','2026-05-17 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.253','2026-05-17 16:49:35.253'),
(287,'TURNO_SERV_CECO_24H_20260516_M',5,'2026-05-16','2026-05-16 06:00:00.000','2026-05-16 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.263','2026-05-17 16:49:35.263'),
(288,'TURNO_SERV_CECO_24H_20260516_T',5,'2026-05-16','2026-05-16 14:00:00.000','2026-05-16 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.273','2026-05-17 16:49:35.273'),
(289,'TURNO_SERV_CECO_24H_20260516_N',5,'2026-05-16','2026-05-16 22:00:00.000','2026-05-17 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.283','2026-05-17 16:49:35.283'),
(290,'TURNO_SERV_TER_NOCTURNO_20260516_N',7,'2026-05-16','2026-05-16 22:00:00.000','2026-05-17 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.293','2026-05-17 16:49:35.293'),
(291,'TURNO_SERV_HUE_VARIABLE_20260516_M',8,'2026-05-16','2026-05-16 06:00:00.000','2026-05-16 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.304','2026-05-17 16:49:35.304'),
(292,'TURNO_SERV_HUE_VARIABLE_20260516_T',8,'2026-05-16','2026-05-16 14:00:00.000','2026-05-16 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.319','2026-05-17 16:49:35.319'),
(293,'TURNO_SERV_HUE_VARIABLE_20260516_N',8,'2026-05-16','2026-05-16 22:00:00.000','2026-05-17 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.330','2026-05-17 16:49:35.330'),
(294,'TURNO_SERV_SF_24H_20260517_M',1,'2026-05-17','2026-05-17 06:00:00.000','2026-05-17 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.340','2026-05-17 16:49:35.340'),
(295,'TURNO_SERV_SF_24H_20260517_T',1,'2026-05-17','2026-05-17 14:00:00.000','2026-05-17 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.351','2026-05-17 16:49:35.351'),
(296,'TURNO_SERV_SF_24H_20260517_N',1,'2026-05-17','2026-05-17 22:00:00.000','2026-05-18 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.362','2026-05-17 16:49:35.362'),
(297,'TURNO_SERV_PAR_24H_20260517_M',2,'2026-05-17','2026-05-17 06:00:00.000','2026-05-17 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.372','2026-05-17 16:49:35.372'),
(298,'TURNO_SERV_PAR_24H_20260517_T',2,'2026-05-17','2026-05-17 14:00:00.000','2026-05-17 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.383','2026-05-17 16:49:35.383'),
(299,'TURNO_SERV_PAR_24H_20260517_N',2,'2026-05-17','2026-05-17 22:00:00.000','2026-05-18 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.393','2026-05-17 16:49:35.393'),
(300,'TURNO_SERV_VET_24H_20260517_M',3,'2026-05-17','2026-05-17 06:00:00.000','2026-05-17 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.404','2026-05-17 16:49:35.404'),
(301,'TURNO_SERV_VET_24H_20260517_T',3,'2026-05-17','2026-05-17 14:00:00.000','2026-05-17 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.414','2026-05-17 16:49:35.414'),
(302,'TURNO_SERV_VET_24H_20260517_N',3,'2026-05-17','2026-05-17 22:00:00.000','2026-05-18 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.427','2026-05-17 16:49:35.427'),
(303,'TURNO_SERV_RE_24H_20260517_M',4,'2026-05-17','2026-05-17 06:00:00.000','2026-05-17 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.438','2026-05-17 16:49:35.438'),
(304,'TURNO_SERV_RE_24H_20260517_T',4,'2026-05-17','2026-05-17 14:00:00.000','2026-05-17 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.448','2026-05-17 16:49:35.448'),
(305,'TURNO_SERV_RE_24H_20260517_N',4,'2026-05-17','2026-05-17 22:00:00.000','2026-05-18 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.458','2026-05-17 16:49:35.458'),
(306,'TURNO_SERV_CECO_24H_20260517_M',5,'2026-05-17','2026-05-17 06:00:00.000','2026-05-17 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.469','2026-05-17 16:49:35.469'),
(307,'TURNO_SERV_CECO_24H_20260517_T',5,'2026-05-17','2026-05-17 14:00:00.000','2026-05-17 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.479','2026-05-17 16:49:35.479'),
(308,'TURNO_SERV_CECO_24H_20260517_N',5,'2026-05-17','2026-05-17 22:00:00.000','2026-05-18 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.489','2026-05-17 16:49:35.489'),
(309,'TURNO_SERV_TER_NOCTURNO_20260517_N',7,'2026-05-17','2026-05-17 22:00:00.000','2026-05-18 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.499','2026-05-17 16:49:35.499'),
(310,'TURNO_SERV_HUE_VARIABLE_20260517_M',8,'2026-05-17','2026-05-17 06:00:00.000','2026-05-17 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.509','2026-05-17 16:49:35.509'),
(311,'TURNO_SERV_HUE_VARIABLE_20260517_T',8,'2026-05-17','2026-05-17 14:00:00.000','2026-05-17 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.520','2026-05-17 16:49:35.520'),
(312,'TURNO_SERV_HUE_VARIABLE_20260517_N',8,'2026-05-17','2026-05-17 22:00:00.000','2026-05-18 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.534','2026-05-17 16:49:35.534'),
(313,'TURNO_SERV_SF_24H_20260518_M',1,'2026-05-18','2026-05-18 06:00:00.000','2026-05-18 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.545','2026-05-17 16:49:35.545'),
(314,'TURNO_SERV_SF_24H_20260518_T',1,'2026-05-18','2026-05-18 14:00:00.000','2026-05-18 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.556','2026-05-17 16:49:35.556'),
(315,'TURNO_SERV_SF_24H_20260518_N',1,'2026-05-18','2026-05-18 22:00:00.000','2026-05-19 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.567','2026-05-17 16:49:35.567'),
(316,'TURNO_SERV_PAR_24H_20260518_M',2,'2026-05-18','2026-05-18 06:00:00.000','2026-05-18 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.578','2026-05-17 16:49:35.578'),
(317,'TURNO_SERV_PAR_24H_20260518_T',2,'2026-05-18','2026-05-18 14:00:00.000','2026-05-18 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.589','2026-05-17 16:49:35.589'),
(318,'TURNO_SERV_PAR_24H_20260518_N',2,'2026-05-18','2026-05-18 22:00:00.000','2026-05-19 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.601','2026-05-17 16:49:35.601'),
(319,'TURNO_SERV_VET_24H_20260518_M',3,'2026-05-18','2026-05-18 06:00:00.000','2026-05-18 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.612','2026-05-17 16:49:35.612'),
(320,'TURNO_SERV_VET_24H_20260518_T',3,'2026-05-18','2026-05-18 14:00:00.000','2026-05-18 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.622','2026-05-17 16:49:35.622'),
(321,'TURNO_SERV_VET_24H_20260518_N',3,'2026-05-18','2026-05-18 22:00:00.000','2026-05-19 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.632','2026-05-17 16:49:35.632'),
(322,'TURNO_SERV_RE_24H_20260518_M',4,'2026-05-18','2026-05-18 06:00:00.000','2026-05-18 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.646','2026-05-17 16:49:35.646'),
(323,'TURNO_SERV_RE_24H_20260518_T',4,'2026-05-18','2026-05-18 14:00:00.000','2026-05-18 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.656','2026-05-17 16:49:35.656'),
(324,'TURNO_SERV_RE_24H_20260518_N',4,'2026-05-18','2026-05-18 22:00:00.000','2026-05-19 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.671','2026-05-17 16:49:35.671'),
(325,'TURNO_SERV_CECO_24H_20260518_M',5,'2026-05-18','2026-05-18 06:00:00.000','2026-05-18 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.682','2026-05-17 16:49:35.682'),
(326,'TURNO_SERV_CECO_24H_20260518_T',5,'2026-05-18','2026-05-18 14:00:00.000','2026-05-18 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.692','2026-05-17 16:49:35.692'),
(327,'TURNO_SERV_CECO_24H_20260518_N',5,'2026-05-18','2026-05-18 22:00:00.000','2026-05-19 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.706','2026-05-17 16:49:35.706'),
(328,'TURNO_SERV_CECO_JEFE_20260518_D',6,'2026-05-18','2026-05-18 08:00:00.000','2026-05-18 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.717','2026-05-17 16:49:35.717'),
(329,'TURNO_SERV_TER_NOCTURNO_20260518_N',7,'2026-05-18','2026-05-18 22:00:00.000','2026-05-19 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.727','2026-05-17 16:49:35.727'),
(330,'TURNO_SERV_HUE_VARIABLE_20260518_N',8,'2026-05-18','2026-05-18 22:00:00.000','2026-05-19 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.738','2026-05-17 16:49:35.738'),
(331,'TURNO_SERV_SF_24H_20260519_M',1,'2026-05-19','2026-05-19 06:00:00.000','2026-05-19 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.749','2026-05-17 16:49:35.749'),
(332,'TURNO_SERV_SF_24H_20260519_T',1,'2026-05-19','2026-05-19 14:00:00.000','2026-05-19 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.760','2026-05-17 16:49:35.760'),
(333,'TURNO_SERV_SF_24H_20260519_N',1,'2026-05-19','2026-05-19 22:00:00.000','2026-05-20 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.771','2026-05-17 16:49:35.771'),
(334,'TURNO_SERV_PAR_24H_20260519_M',2,'2026-05-19','2026-05-19 06:00:00.000','2026-05-19 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.782','2026-05-17 16:49:35.782'),
(335,'TURNO_SERV_PAR_24H_20260519_T',2,'2026-05-19','2026-05-19 14:00:00.000','2026-05-19 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.793','2026-05-17 16:49:35.793'),
(336,'TURNO_SERV_PAR_24H_20260519_N',2,'2026-05-19','2026-05-19 22:00:00.000','2026-05-20 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.804','2026-05-17 16:49:35.804'),
(337,'TURNO_SERV_VET_24H_20260519_M',3,'2026-05-19','2026-05-19 06:00:00.000','2026-05-19 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.820','2026-05-17 16:49:35.820'),
(338,'TURNO_SERV_VET_24H_20260519_T',3,'2026-05-19','2026-05-19 14:00:00.000','2026-05-19 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.830','2026-05-17 16:49:35.830'),
(339,'TURNO_SERV_VET_24H_20260519_N',3,'2026-05-19','2026-05-19 22:00:00.000','2026-05-20 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.840','2026-05-17 16:49:35.840'),
(340,'TURNO_SERV_RE_24H_20260519_M',4,'2026-05-19','2026-05-19 06:00:00.000','2026-05-19 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.850','2026-05-17 16:49:35.850'),
(341,'TURNO_SERV_RE_24H_20260519_T',4,'2026-05-19','2026-05-19 14:00:00.000','2026-05-19 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.860','2026-05-17 16:49:35.860'),
(342,'TURNO_SERV_RE_24H_20260519_N',4,'2026-05-19','2026-05-19 22:00:00.000','2026-05-20 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.870','2026-05-17 16:49:35.870'),
(343,'TURNO_SERV_CECO_24H_20260519_M',5,'2026-05-19','2026-05-19 06:00:00.000','2026-05-19 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.880','2026-05-17 16:49:35.880'),
(344,'TURNO_SERV_CECO_24H_20260519_T',5,'2026-05-19','2026-05-19 14:00:00.000','2026-05-19 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.891','2026-05-17 16:49:35.891'),
(345,'TURNO_SERV_CECO_24H_20260519_N',5,'2026-05-19','2026-05-19 22:00:00.000','2026-05-20 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.901','2026-05-17 16:49:35.901'),
(346,'TURNO_SERV_CECO_JEFE_20260519_D',6,'2026-05-19','2026-05-19 08:00:00.000','2026-05-19 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.912','2026-05-17 16:49:35.912'),
(347,'TURNO_SERV_TER_NOCTURNO_20260519_N',7,'2026-05-19','2026-05-19 22:00:00.000','2026-05-20 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.925','2026-05-17 16:49:35.925'),
(348,'TURNO_SERV_HUE_VARIABLE_20260519_N',8,'2026-05-19','2026-05-19 22:00:00.000','2026-05-20 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.936','2026-05-17 16:49:35.936'),
(349,'TURNO_SERV_SF_24H_20260520_M',1,'2026-05-20','2026-05-20 06:00:00.000','2026-05-20 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.947','2026-05-17 16:49:35.947'),
(350,'TURNO_SERV_SF_24H_20260520_T',1,'2026-05-20','2026-05-20 14:00:00.000','2026-05-20 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.958','2026-05-17 16:49:35.958'),
(351,'TURNO_SERV_SF_24H_20260520_N',1,'2026-05-20','2026-05-20 22:00:00.000','2026-05-21 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:35.969','2026-05-17 16:49:35.969'),
(352,'TURNO_SERV_PAR_24H_20260520_M',2,'2026-05-20','2026-05-20 06:00:00.000','2026-05-20 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.980','2026-05-17 16:49:35.980'),
(353,'TURNO_SERV_PAR_24H_20260520_T',2,'2026-05-20','2026-05-20 14:00:00.000','2026-05-20 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:35.992','2026-05-17 16:49:35.992'),
(354,'TURNO_SERV_PAR_24H_20260520_N',2,'2026-05-20','2026-05-20 22:00:00.000','2026-05-21 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.002','2026-05-17 16:49:36.002'),
(355,'TURNO_SERV_VET_24H_20260520_M',3,'2026-05-20','2026-05-20 06:00:00.000','2026-05-20 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.013','2026-05-17 16:49:36.013'),
(356,'TURNO_SERV_VET_24H_20260520_T',3,'2026-05-20','2026-05-20 14:00:00.000','2026-05-20 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.023','2026-05-17 16:49:36.023'),
(357,'TURNO_SERV_VET_24H_20260520_N',3,'2026-05-20','2026-05-20 22:00:00.000','2026-05-21 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.037','2026-05-17 16:49:36.037'),
(358,'TURNO_SERV_RE_24H_20260520_M',4,'2026-05-20','2026-05-20 06:00:00.000','2026-05-20 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.047','2026-05-17 16:49:36.047'),
(359,'TURNO_SERV_RE_24H_20260520_T',4,'2026-05-20','2026-05-20 14:00:00.000','2026-05-20 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.057','2026-05-17 16:49:36.057'),
(360,'TURNO_SERV_RE_24H_20260520_N',4,'2026-05-20','2026-05-20 22:00:00.000','2026-05-21 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.067','2026-05-17 16:49:36.067'),
(361,'TURNO_SERV_CECO_24H_20260520_M',5,'2026-05-20','2026-05-20 06:00:00.000','2026-05-20 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.078','2026-05-17 16:49:36.078'),
(362,'TURNO_SERV_CECO_24H_20260520_T',5,'2026-05-20','2026-05-20 14:00:00.000','2026-05-20 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.088','2026-05-17 16:49:36.088'),
(363,'TURNO_SERV_CECO_24H_20260520_N',5,'2026-05-20','2026-05-20 22:00:00.000','2026-05-21 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.098','2026-05-17 16:49:36.098'),
(364,'TURNO_SERV_CECO_JEFE_20260520_D',6,'2026-05-20','2026-05-20 08:00:00.000','2026-05-20 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.108','2026-05-17 16:49:36.108'),
(365,'TURNO_SERV_TER_NOCTURNO_20260520_N',7,'2026-05-20','2026-05-20 22:00:00.000','2026-05-21 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.119','2026-05-17 16:49:36.119'),
(366,'TURNO_SERV_HUE_VARIABLE_20260520_N',8,'2026-05-20','2026-05-20 22:00:00.000','2026-05-21 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.130','2026-05-17 16:49:36.130'),
(367,'TURNO_SERV_SF_24H_20260521_M',1,'2026-05-21','2026-05-21 06:00:00.000','2026-05-21 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.144','2026-05-17 16:49:36.144'),
(368,'TURNO_SERV_SF_24H_20260521_T',1,'2026-05-21','2026-05-21 14:00:00.000','2026-05-21 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.155','2026-05-17 16:49:36.155'),
(369,'TURNO_SERV_SF_24H_20260521_N',1,'2026-05-21','2026-05-21 22:00:00.000','2026-05-22 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.166','2026-05-17 16:49:36.166'),
(370,'TURNO_SERV_PAR_24H_20260521_M',2,'2026-05-21','2026-05-21 06:00:00.000','2026-05-21 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.177','2026-05-17 16:49:36.177'),
(371,'TURNO_SERV_PAR_24H_20260521_T',2,'2026-05-21','2026-05-21 14:00:00.000','2026-05-21 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.187','2026-05-17 16:49:36.187'),
(372,'TURNO_SERV_PAR_24H_20260521_N',2,'2026-05-21','2026-05-21 22:00:00.000','2026-05-22 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.197','2026-05-17 16:49:36.197'),
(373,'TURNO_SERV_VET_24H_20260521_M',3,'2026-05-21','2026-05-21 06:00:00.000','2026-05-21 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.208','2026-05-17 16:49:36.208'),
(374,'TURNO_SERV_VET_24H_20260521_T',3,'2026-05-21','2026-05-21 14:00:00.000','2026-05-21 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.219','2026-05-17 16:49:36.219'),
(375,'TURNO_SERV_VET_24H_20260521_N',3,'2026-05-21','2026-05-21 22:00:00.000','2026-05-22 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.229','2026-05-17 16:49:36.229'),
(376,'TURNO_SERV_RE_24H_20260521_M',4,'2026-05-21','2026-05-21 06:00:00.000','2026-05-21 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.239','2026-05-17 16:49:36.239'),
(377,'TURNO_SERV_RE_24H_20260521_T',4,'2026-05-21','2026-05-21 14:00:00.000','2026-05-21 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.252','2026-05-17 16:49:36.252'),
(378,'TURNO_SERV_RE_24H_20260521_N',4,'2026-05-21','2026-05-21 22:00:00.000','2026-05-22 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.262','2026-05-17 16:49:36.262'),
(379,'TURNO_SERV_CECO_24H_20260521_M',5,'2026-05-21','2026-05-21 06:00:00.000','2026-05-21 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.271','2026-05-17 16:49:36.271'),
(380,'TURNO_SERV_CECO_24H_20260521_T',5,'2026-05-21','2026-05-21 14:00:00.000','2026-05-21 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.281','2026-05-17 16:49:36.281'),
(381,'TURNO_SERV_CECO_24H_20260521_N',5,'2026-05-21','2026-05-21 22:00:00.000','2026-05-22 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.291','2026-05-17 16:49:36.291'),
(382,'TURNO_SERV_CECO_JEFE_20260521_D',6,'2026-05-21','2026-05-21 08:00:00.000','2026-05-21 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.301','2026-05-17 16:49:36.301'),
(383,'TURNO_SERV_TER_NOCTURNO_20260521_N',7,'2026-05-21','2026-05-21 22:00:00.000','2026-05-22 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.311','2026-05-17 16:49:36.311'),
(384,'TURNO_SERV_HUE_VARIABLE_20260521_N',8,'2026-05-21','2026-05-21 22:00:00.000','2026-05-22 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.321','2026-05-17 16:49:36.321'),
(385,'TURNO_SERV_SF_24H_20260522_M',1,'2026-05-22','2026-05-22 06:00:00.000','2026-05-22 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.332','2026-05-17 16:49:36.332'),
(386,'TURNO_SERV_SF_24H_20260522_T',1,'2026-05-22','2026-05-22 14:00:00.000','2026-05-22 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.343','2026-05-17 16:49:36.343'),
(387,'TURNO_SERV_SF_24H_20260522_N',1,'2026-05-22','2026-05-22 22:00:00.000','2026-05-23 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.358','2026-05-17 16:49:36.358'),
(388,'TURNO_SERV_PAR_24H_20260522_M',2,'2026-05-22','2026-05-22 06:00:00.000','2026-05-22 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.367','2026-05-17 16:49:36.367'),
(389,'TURNO_SERV_PAR_24H_20260522_T',2,'2026-05-22','2026-05-22 14:00:00.000','2026-05-22 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.377','2026-05-17 16:49:36.377'),
(390,'TURNO_SERV_PAR_24H_20260522_N',2,'2026-05-22','2026-05-22 22:00:00.000','2026-05-23 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.388','2026-05-17 16:49:36.388'),
(391,'TURNO_SERV_VET_24H_20260522_M',3,'2026-05-22','2026-05-22 06:00:00.000','2026-05-22 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.398','2026-05-17 16:49:36.398'),
(392,'TURNO_SERV_VET_24H_20260522_T',3,'2026-05-22','2026-05-22 14:00:00.000','2026-05-22 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.409','2026-05-17 16:49:36.409'),
(393,'TURNO_SERV_VET_24H_20260522_N',3,'2026-05-22','2026-05-22 22:00:00.000','2026-05-23 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.419','2026-05-17 16:49:36.419'),
(394,'TURNO_SERV_RE_24H_20260522_M',4,'2026-05-22','2026-05-22 06:00:00.000','2026-05-22 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.430','2026-05-17 16:49:36.430'),
(395,'TURNO_SERV_RE_24H_20260522_T',4,'2026-05-22','2026-05-22 14:00:00.000','2026-05-22 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.440','2026-05-17 16:49:36.440'),
(396,'TURNO_SERV_RE_24H_20260522_N',4,'2026-05-22','2026-05-22 22:00:00.000','2026-05-23 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.450','2026-05-17 16:49:36.450'),
(397,'TURNO_SERV_CECO_24H_20260522_M',5,'2026-05-22','2026-05-22 06:00:00.000','2026-05-22 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.463','2026-05-17 16:49:36.463'),
(398,'TURNO_SERV_CECO_24H_20260522_T',5,'2026-05-22','2026-05-22 14:00:00.000','2026-05-22 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.473','2026-05-17 16:49:36.473'),
(399,'TURNO_SERV_CECO_24H_20260522_N',5,'2026-05-22','2026-05-22 22:00:00.000','2026-05-23 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.483','2026-05-17 16:49:36.483'),
(400,'TURNO_SERV_CECO_JEFE_20260522_D',6,'2026-05-22','2026-05-22 08:00:00.000','2026-05-22 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.494','2026-05-17 16:49:36.494'),
(401,'TURNO_SERV_TER_NOCTURNO_20260522_N',7,'2026-05-22','2026-05-22 22:00:00.000','2026-05-23 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.505','2026-05-17 16:49:36.505'),
(402,'TURNO_SERV_HUE_VARIABLE_20260522_N',8,'2026-05-22','2026-05-22 22:00:00.000','2026-05-23 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.516','2026-05-17 16:49:36.516'),
(403,'TURNO_SERV_SF_24H_20260523_M',1,'2026-05-23','2026-05-23 06:00:00.000','2026-05-23 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.526','2026-05-17 16:49:36.526'),
(404,'TURNO_SERV_SF_24H_20260523_T',1,'2026-05-23','2026-05-23 14:00:00.000','2026-05-23 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.537','2026-05-17 16:49:36.537'),
(405,'TURNO_SERV_SF_24H_20260523_N',1,'2026-05-23','2026-05-23 22:00:00.000','2026-05-24 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.548','2026-05-17 16:49:36.548'),
(406,'TURNO_SERV_PAR_24H_20260523_M',2,'2026-05-23','2026-05-23 06:00:00.000','2026-05-23 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.558','2026-05-17 16:49:36.558'),
(407,'TURNO_SERV_PAR_24H_20260523_T',2,'2026-05-23','2026-05-23 14:00:00.000','2026-05-23 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.580','2026-05-17 16:49:36.580'),
(408,'TURNO_SERV_PAR_24H_20260523_N',2,'2026-05-23','2026-05-23 22:00:00.000','2026-05-24 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.591','2026-05-17 16:49:36.591'),
(409,'TURNO_SERV_VET_24H_20260523_M',3,'2026-05-23','2026-05-23 06:00:00.000','2026-05-23 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.609','2026-05-17 16:49:36.609'),
(410,'TURNO_SERV_VET_24H_20260523_T',3,'2026-05-23','2026-05-23 14:00:00.000','2026-05-23 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.620','2026-05-17 16:49:36.620'),
(411,'TURNO_SERV_VET_24H_20260523_N',3,'2026-05-23','2026-05-23 22:00:00.000','2026-05-24 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.630','2026-05-17 16:49:36.630'),
(412,'TURNO_SERV_RE_24H_20260523_M',4,'2026-05-23','2026-05-23 06:00:00.000','2026-05-23 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.641','2026-05-17 16:49:36.641'),
(413,'TURNO_SERV_RE_24H_20260523_T',4,'2026-05-23','2026-05-23 14:00:00.000','2026-05-23 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.651','2026-05-17 16:49:36.651'),
(414,'TURNO_SERV_RE_24H_20260523_N',4,'2026-05-23','2026-05-23 22:00:00.000','2026-05-24 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.661','2026-05-17 16:49:36.661'),
(415,'TURNO_SERV_CECO_24H_20260523_M',5,'2026-05-23','2026-05-23 06:00:00.000','2026-05-23 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.674','2026-05-17 16:49:36.674'),
(416,'TURNO_SERV_CECO_24H_20260523_T',5,'2026-05-23','2026-05-23 14:00:00.000','2026-05-23 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.685','2026-05-17 16:49:36.685'),
(417,'TURNO_SERV_CECO_24H_20260523_N',5,'2026-05-23','2026-05-23 22:00:00.000','2026-05-24 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.697','2026-05-17 16:49:36.697'),
(418,'TURNO_SERV_TER_NOCTURNO_20260523_N',7,'2026-05-23','2026-05-23 22:00:00.000','2026-05-24 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.707','2026-05-17 16:49:36.707'),
(419,'TURNO_SERV_HUE_VARIABLE_20260523_M',8,'2026-05-23','2026-05-23 06:00:00.000','2026-05-23 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.719','2026-05-17 16:49:36.719'),
(420,'TURNO_SERV_HUE_VARIABLE_20260523_T',8,'2026-05-23','2026-05-23 14:00:00.000','2026-05-23 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.733','2026-05-17 16:49:36.733'),
(421,'TURNO_SERV_HUE_VARIABLE_20260523_N',8,'2026-05-23','2026-05-23 22:00:00.000','2026-05-24 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.743','2026-05-17 16:49:36.743'),
(422,'TURNO_SERV_SF_24H_20260524_M',1,'2026-05-24','2026-05-24 06:00:00.000','2026-05-24 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.753','2026-05-17 16:49:36.753'),
(423,'TURNO_SERV_SF_24H_20260524_T',1,'2026-05-24','2026-05-24 14:00:00.000','2026-05-24 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.765','2026-05-17 16:49:36.765'),
(424,'TURNO_SERV_SF_24H_20260524_N',1,'2026-05-24','2026-05-24 22:00:00.000','2026-05-25 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.775','2026-05-17 16:49:36.775'),
(425,'TURNO_SERV_PAR_24H_20260524_M',2,'2026-05-24','2026-05-24 06:00:00.000','2026-05-24 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.787','2026-05-17 16:49:36.787'),
(426,'TURNO_SERV_PAR_24H_20260524_T',2,'2026-05-24','2026-05-24 14:00:00.000','2026-05-24 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.796','2026-05-17 16:49:36.796'),
(427,'TURNO_SERV_PAR_24H_20260524_N',2,'2026-05-24','2026-05-24 22:00:00.000','2026-05-25 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.807','2026-05-17 16:49:36.807'),
(428,'TURNO_SERV_VET_24H_20260524_M',3,'2026-05-24','2026-05-24 06:00:00.000','2026-05-24 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.817','2026-05-17 16:49:36.817'),
(429,'TURNO_SERV_VET_24H_20260524_T',3,'2026-05-24','2026-05-24 14:00:00.000','2026-05-24 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.828','2026-05-17 16:49:36.828'),
(430,'TURNO_SERV_VET_24H_20260524_N',3,'2026-05-24','2026-05-24 22:00:00.000','2026-05-25 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.842','2026-05-17 16:49:36.842'),
(431,'TURNO_SERV_RE_24H_20260524_M',4,'2026-05-24','2026-05-24 06:00:00.000','2026-05-24 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.852','2026-05-17 16:49:36.852'),
(432,'TURNO_SERV_RE_24H_20260524_T',4,'2026-05-24','2026-05-24 14:00:00.000','2026-05-24 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.864','2026-05-17 16:49:36.864'),
(433,'TURNO_SERV_RE_24H_20260524_N',4,'2026-05-24','2026-05-24 22:00:00.000','2026-05-25 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.873','2026-05-17 16:49:36.873'),
(434,'TURNO_SERV_CECO_24H_20260524_M',5,'2026-05-24','2026-05-24 06:00:00.000','2026-05-24 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.884','2026-05-17 16:49:36.884'),
(435,'TURNO_SERV_CECO_24H_20260524_T',5,'2026-05-24','2026-05-24 14:00:00.000','2026-05-24 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.895','2026-05-17 16:49:36.895'),
(436,'TURNO_SERV_CECO_24H_20260524_N',5,'2026-05-24','2026-05-24 22:00:00.000','2026-05-25 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.907','2026-05-17 16:49:36.907'),
(437,'TURNO_SERV_TER_NOCTURNO_20260524_N',7,'2026-05-24','2026-05-24 22:00:00.000','2026-05-25 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.917','2026-05-17 16:49:36.917'),
(438,'TURNO_SERV_HUE_VARIABLE_20260524_M',8,'2026-05-24','2026-05-24 06:00:00.000','2026-05-24 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.929','2026-05-17 16:49:36.929'),
(439,'TURNO_SERV_HUE_VARIABLE_20260524_T',8,'2026-05-24','2026-05-24 14:00:00.000','2026-05-24 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.939','2026-05-17 16:49:36.939'),
(440,'TURNO_SERV_HUE_VARIABLE_20260524_N',8,'2026-05-24','2026-05-24 22:00:00.000','2026-05-25 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.953','2026-05-17 16:49:36.953'),
(441,'TURNO_SERV_SF_24H_20260525_M',1,'2026-05-25','2026-05-25 06:00:00.000','2026-05-25 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.963','2026-05-17 16:49:36.963'),
(442,'TURNO_SERV_SF_24H_20260525_T',1,'2026-05-25','2026-05-25 14:00:00.000','2026-05-25 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.973','2026-05-17 16:49:36.973'),
(443,'TURNO_SERV_SF_24H_20260525_N',1,'2026-05-25','2026-05-25 22:00:00.000','2026-05-26 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:36.983','2026-05-17 16:49:36.983'),
(444,'TURNO_SERV_PAR_24H_20260525_M',2,'2026-05-25','2026-05-25 06:00:00.000','2026-05-25 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:36.995','2026-05-17 16:49:36.995'),
(445,'TURNO_SERV_PAR_24H_20260525_T',2,'2026-05-25','2026-05-25 14:00:00.000','2026-05-25 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.006','2026-05-17 16:49:37.006'),
(446,'TURNO_SERV_PAR_24H_20260525_N',2,'2026-05-25','2026-05-25 22:00:00.000','2026-05-26 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.017','2026-05-17 16:49:37.017'),
(447,'TURNO_SERV_VET_24H_20260525_M',3,'2026-05-25','2026-05-25 06:00:00.000','2026-05-25 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.029','2026-05-17 16:49:37.029'),
(448,'TURNO_SERV_VET_24H_20260525_T',3,'2026-05-25','2026-05-25 14:00:00.000','2026-05-25 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.039','2026-05-17 16:49:37.039'),
(449,'TURNO_SERV_VET_24H_20260525_N',3,'2026-05-25','2026-05-25 22:00:00.000','2026-05-26 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.051','2026-05-17 16:49:37.051'),
(450,'TURNO_SERV_RE_24H_20260525_M',4,'2026-05-25','2026-05-25 06:00:00.000','2026-05-25 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.065','2026-05-17 16:49:37.065'),
(451,'TURNO_SERV_RE_24H_20260525_T',4,'2026-05-25','2026-05-25 14:00:00.000','2026-05-25 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.075','2026-05-17 16:49:37.075'),
(452,'TURNO_SERV_RE_24H_20260525_N',4,'2026-05-25','2026-05-25 22:00:00.000','2026-05-26 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.086','2026-05-17 16:49:37.086'),
(453,'TURNO_SERV_CECO_24H_20260525_M',5,'2026-05-25','2026-05-25 06:00:00.000','2026-05-25 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.097','2026-05-17 16:49:37.097'),
(454,'TURNO_SERV_CECO_24H_20260525_T',5,'2026-05-25','2026-05-25 14:00:00.000','2026-05-25 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.107','2026-05-17 16:49:37.107'),
(455,'TURNO_SERV_CECO_24H_20260525_N',5,'2026-05-25','2026-05-25 22:00:00.000','2026-05-26 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.117','2026-05-17 16:49:37.117'),
(456,'TURNO_SERV_CECO_JEFE_20260525_D',6,'2026-05-25','2026-05-25 08:00:00.000','2026-05-25 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.127','2026-05-17 16:49:37.127'),
(457,'TURNO_SERV_TER_NOCTURNO_20260525_N',7,'2026-05-25','2026-05-25 22:00:00.000','2026-05-26 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.138','2026-05-17 16:49:37.138'),
(458,'TURNO_SERV_HUE_VARIABLE_20260525_N',8,'2026-05-25','2026-05-25 22:00:00.000','2026-05-26 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.148','2026-05-17 16:49:37.148'),
(459,'TURNO_SERV_SF_24H_20260526_M',1,'2026-05-26','2026-05-26 06:00:00.000','2026-05-26 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.159','2026-05-17 16:49:37.159'),
(460,'TURNO_SERV_SF_24H_20260526_T',1,'2026-05-26','2026-05-26 14:00:00.000','2026-05-26 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.174','2026-05-17 16:49:37.174'),
(461,'TURNO_SERV_SF_24H_20260526_N',1,'2026-05-26','2026-05-26 22:00:00.000','2026-05-27 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.185','2026-05-17 16:49:37.185'),
(462,'TURNO_SERV_PAR_24H_20260526_M',2,'2026-05-26','2026-05-26 06:00:00.000','2026-05-26 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.197','2026-05-17 16:49:37.197'),
(463,'TURNO_SERV_PAR_24H_20260526_T',2,'2026-05-26','2026-05-26 14:00:00.000','2026-05-26 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.207','2026-05-17 16:49:37.207'),
(464,'TURNO_SERV_PAR_24H_20260526_N',2,'2026-05-26','2026-05-26 22:00:00.000','2026-05-27 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.218','2026-05-17 16:49:37.218'),
(465,'TURNO_SERV_VET_24H_20260526_M',3,'2026-05-26','2026-05-26 06:00:00.000','2026-05-26 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.229','2026-05-17 16:49:37.229'),
(466,'TURNO_SERV_VET_24H_20260526_T',3,'2026-05-26','2026-05-26 14:00:00.000','2026-05-26 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.239','2026-05-17 16:49:37.239'),
(467,'TURNO_SERV_VET_24H_20260526_N',3,'2026-05-26','2026-05-26 22:00:00.000','2026-05-27 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.249','2026-05-17 16:49:37.249'),
(468,'TURNO_SERV_RE_24H_20260526_M',4,'2026-05-26','2026-05-26 06:00:00.000','2026-05-26 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.259','2026-05-17 16:49:37.259'),
(469,'TURNO_SERV_RE_24H_20260526_T',4,'2026-05-26','2026-05-26 14:00:00.000','2026-05-26 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.269','2026-05-17 16:49:37.269'),
(470,'TURNO_SERV_RE_24H_20260526_N',4,'2026-05-26','2026-05-26 22:00:00.000','2026-05-27 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.282','2026-05-17 16:49:37.282'),
(471,'TURNO_SERV_CECO_24H_20260526_M',5,'2026-05-26','2026-05-26 06:00:00.000','2026-05-26 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.292','2026-05-17 16:49:37.292'),
(472,'TURNO_SERV_CECO_24H_20260526_T',5,'2026-05-26','2026-05-26 14:00:00.000','2026-05-26 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.302','2026-05-17 16:49:37.302'),
(473,'TURNO_SERV_CECO_24H_20260526_N',5,'2026-05-26','2026-05-26 22:00:00.000','2026-05-27 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.312','2026-05-17 16:49:37.312'),
(474,'TURNO_SERV_CECO_JEFE_20260526_D',6,'2026-05-26','2026-05-26 08:00:00.000','2026-05-26 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.322','2026-05-17 16:49:37.322'),
(475,'TURNO_SERV_TER_NOCTURNO_20260526_N',7,'2026-05-26','2026-05-26 22:00:00.000','2026-05-27 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.332','2026-05-17 16:49:37.332'),
(476,'TURNO_SERV_HUE_VARIABLE_20260526_N',8,'2026-05-26','2026-05-26 22:00:00.000','2026-05-27 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.342','2026-05-17 16:49:37.342'),
(477,'TURNO_SERV_SF_24H_20260527_M',1,'2026-05-27','2026-05-27 06:00:00.000','2026-05-27 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.353','2026-05-17 16:49:37.353'),
(478,'TURNO_SERV_SF_24H_20260527_T',1,'2026-05-27','2026-05-27 14:00:00.000','2026-05-27 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.363','2026-05-17 16:49:37.363'),
(479,'TURNO_SERV_SF_24H_20260527_N',1,'2026-05-27','2026-05-27 22:00:00.000','2026-05-28 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.373','2026-05-17 16:49:37.373'),
(480,'TURNO_SERV_PAR_24H_20260527_M',2,'2026-05-27','2026-05-27 06:00:00.000','2026-05-27 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.388','2026-05-17 16:49:37.388'),
(481,'TURNO_SERV_PAR_24H_20260527_T',2,'2026-05-27','2026-05-27 14:00:00.000','2026-05-27 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.398','2026-05-17 16:49:37.398'),
(482,'TURNO_SERV_PAR_24H_20260527_N',2,'2026-05-27','2026-05-27 22:00:00.000','2026-05-28 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.410','2026-05-17 16:49:37.410'),
(483,'TURNO_SERV_VET_24H_20260527_M',3,'2026-05-27','2026-05-27 06:00:00.000','2026-05-27 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.421','2026-05-17 16:49:37.421'),
(484,'TURNO_SERV_VET_24H_20260527_T',3,'2026-05-27','2026-05-27 14:00:00.000','2026-05-27 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.431','2026-05-17 16:49:37.431'),
(485,'TURNO_SERV_VET_24H_20260527_N',3,'2026-05-27','2026-05-27 22:00:00.000','2026-05-28 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.441','2026-05-17 16:49:37.441'),
(486,'TURNO_SERV_RE_24H_20260527_M',4,'2026-05-27','2026-05-27 06:00:00.000','2026-05-27 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.451','2026-05-17 16:49:37.451'),
(487,'TURNO_SERV_RE_24H_20260527_T',4,'2026-05-27','2026-05-27 14:00:00.000','2026-05-27 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.461','2026-05-17 16:49:37.461'),
(488,'TURNO_SERV_RE_24H_20260527_N',4,'2026-05-27','2026-05-27 22:00:00.000','2026-05-28 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.471','2026-05-17 16:49:37.471'),
(489,'TURNO_SERV_CECO_24H_20260527_M',5,'2026-05-27','2026-05-27 06:00:00.000','2026-05-27 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.481','2026-05-17 16:49:37.481'),
(490,'TURNO_SERV_CECO_24H_20260527_T',5,'2026-05-27','2026-05-27 14:00:00.000','2026-05-27 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.494','2026-05-17 16:49:37.494'),
(491,'TURNO_SERV_CECO_24H_20260527_N',5,'2026-05-27','2026-05-27 22:00:00.000','2026-05-28 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.504','2026-05-17 16:49:37.504'),
(492,'TURNO_SERV_CECO_JEFE_20260527_D',6,'2026-05-27','2026-05-27 08:00:00.000','2026-05-27 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.514','2026-05-17 16:49:37.514'),
(493,'TURNO_SERV_TER_NOCTURNO_20260527_N',7,'2026-05-27','2026-05-27 22:00:00.000','2026-05-28 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.524','2026-05-17 16:49:37.524'),
(494,'TURNO_SERV_HUE_VARIABLE_20260527_N',8,'2026-05-27','2026-05-27 22:00:00.000','2026-05-28 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.534','2026-05-17 16:49:37.534'),
(495,'TURNO_SERV_SF_24H_20260528_M',1,'2026-05-28','2026-05-28 06:00:00.000','2026-05-28 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.544','2026-05-17 16:49:37.544'),
(496,'TURNO_SERV_SF_24H_20260528_T',1,'2026-05-28','2026-05-28 14:00:00.000','2026-05-28 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.554','2026-05-17 16:49:37.554'),
(497,'TURNO_SERV_SF_24H_20260528_N',1,'2026-05-28','2026-05-28 22:00:00.000','2026-05-29 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.564','2026-05-17 16:49:37.564'),
(498,'TURNO_SERV_PAR_24H_20260528_M',2,'2026-05-28','2026-05-28 06:00:00.000','2026-05-28 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.574','2026-05-17 16:49:37.574'),
(499,'TURNO_SERV_PAR_24H_20260528_T',2,'2026-05-28','2026-05-28 14:00:00.000','2026-05-28 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.584','2026-05-17 16:49:37.584'),
(500,'TURNO_SERV_PAR_24H_20260528_N',2,'2026-05-28','2026-05-28 22:00:00.000','2026-05-29 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.598','2026-05-17 16:49:37.598'),
(501,'TURNO_SERV_VET_24H_20260528_M',3,'2026-05-28','2026-05-28 06:00:00.000','2026-05-28 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.608','2026-05-17 16:49:37.608'),
(502,'TURNO_SERV_VET_24H_20260528_T',3,'2026-05-28','2026-05-28 14:00:00.000','2026-05-28 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.618','2026-05-17 16:49:37.618'),
(503,'TURNO_SERV_VET_24H_20260528_N',3,'2026-05-28','2026-05-28 22:00:00.000','2026-05-29 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.628','2026-05-17 16:49:37.628'),
(504,'TURNO_SERV_RE_24H_20260528_M',4,'2026-05-28','2026-05-28 06:00:00.000','2026-05-28 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.638','2026-05-17 16:49:37.638'),
(505,'TURNO_SERV_RE_24H_20260528_T',4,'2026-05-28','2026-05-28 14:00:00.000','2026-05-28 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.648','2026-05-17 16:49:37.648'),
(506,'TURNO_SERV_RE_24H_20260528_N',4,'2026-05-28','2026-05-28 22:00:00.000','2026-05-29 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.658','2026-05-17 16:49:37.658'),
(507,'TURNO_SERV_CECO_24H_20260528_M',5,'2026-05-28','2026-05-28 06:00:00.000','2026-05-28 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.668','2026-05-17 16:49:37.668'),
(508,'TURNO_SERV_CECO_24H_20260528_T',5,'2026-05-28','2026-05-28 14:00:00.000','2026-05-28 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.681','2026-05-17 16:49:37.681'),
(509,'TURNO_SERV_CECO_24H_20260528_N',5,'2026-05-28','2026-05-28 22:00:00.000','2026-05-29 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.691','2026-05-17 16:49:37.691'),
(510,'TURNO_SERV_CECO_JEFE_20260528_D',6,'2026-05-28','2026-05-28 08:00:00.000','2026-05-28 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.701','2026-05-17 16:49:37.701'),
(511,'TURNO_SERV_TER_NOCTURNO_20260528_N',7,'2026-05-28','2026-05-28 22:00:00.000','2026-05-29 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.711','2026-05-17 16:49:37.711'),
(512,'TURNO_SERV_HUE_VARIABLE_20260528_N',8,'2026-05-28','2026-05-28 22:00:00.000','2026-05-29 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.721','2026-05-17 16:49:37.721'),
(513,'TURNO_SERV_SF_24H_20260529_M',1,'2026-05-29','2026-05-29 06:00:00.000','2026-05-29 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.730','2026-05-17 16:49:37.730'),
(514,'TURNO_SERV_SF_24H_20260529_T',1,'2026-05-29','2026-05-29 14:00:00.000','2026-05-29 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.743','2026-05-17 16:49:37.743'),
(515,'TURNO_SERV_SF_24H_20260529_N',1,'2026-05-29','2026-05-29 22:00:00.000','2026-05-30 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.753','2026-05-17 16:49:37.753'),
(516,'TURNO_SERV_PAR_24H_20260529_M',2,'2026-05-29','2026-05-29 06:00:00.000','2026-05-29 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.764','2026-05-17 16:49:37.764'),
(517,'TURNO_SERV_PAR_24H_20260529_T',2,'2026-05-29','2026-05-29 14:00:00.000','2026-05-29 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.774','2026-05-17 16:49:37.774'),
(518,'TURNO_SERV_PAR_24H_20260529_N',2,'2026-05-29','2026-05-29 22:00:00.000','2026-05-30 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.784','2026-05-17 16:49:37.784'),
(519,'TURNO_SERV_VET_24H_20260529_M',3,'2026-05-29','2026-05-29 06:00:00.000','2026-05-29 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.793','2026-05-17 16:49:37.793'),
(520,'TURNO_SERV_VET_24H_20260529_T',3,'2026-05-29','2026-05-29 14:00:00.000','2026-05-29 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.803','2026-05-17 16:49:37.803'),
(521,'TURNO_SERV_VET_24H_20260529_N',3,'2026-05-29','2026-05-29 22:00:00.000','2026-05-30 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.812','2026-05-17 16:49:37.812'),
(522,'TURNO_SERV_RE_24H_20260529_M',4,'2026-05-29','2026-05-29 06:00:00.000','2026-05-29 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.822','2026-05-17 16:49:37.822'),
(523,'TURNO_SERV_RE_24H_20260529_T',4,'2026-05-29','2026-05-29 14:00:00.000','2026-05-29 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.832','2026-05-17 16:49:37.832'),
(524,'TURNO_SERV_RE_24H_20260529_N',4,'2026-05-29','2026-05-29 22:00:00.000','2026-05-30 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.842','2026-05-17 16:49:37.842'),
(525,'TURNO_SERV_CECO_24H_20260529_M',5,'2026-05-29','2026-05-29 06:00:00.000','2026-05-29 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.855','2026-05-17 16:49:37.855'),
(526,'TURNO_SERV_CECO_24H_20260529_T',5,'2026-05-29','2026-05-29 14:00:00.000','2026-05-29 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.865','2026-05-17 16:49:37.865'),
(527,'TURNO_SERV_CECO_24H_20260529_N',5,'2026-05-29','2026-05-29 22:00:00.000','2026-05-30 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.876','2026-05-17 16:49:37.876'),
(528,'TURNO_SERV_CECO_JEFE_20260529_D',6,'2026-05-29','2026-05-29 08:00:00.000','2026-05-29 16:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.886','2026-05-17 16:49:37.886'),
(529,'TURNO_SERV_TER_NOCTURNO_20260529_N',7,'2026-05-29','2026-05-29 22:00:00.000','2026-05-30 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.896','2026-05-17 16:49:37.896'),
(530,'TURNO_SERV_HUE_VARIABLE_20260529_N',8,'2026-05-29','2026-05-29 22:00:00.000','2026-05-30 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.906','2026-05-17 16:49:37.906'),
(531,'TURNO_SERV_SF_24H_20260530_M',1,'2026-05-30','2026-05-30 06:00:00.000','2026-05-30 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.918','2026-05-17 16:49:37.918'),
(532,'TURNO_SERV_SF_24H_20260530_T',1,'2026-05-30','2026-05-30 14:00:00.000','2026-05-30 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.928','2026-05-17 16:49:37.928'),
(533,'TURNO_SERV_SF_24H_20260530_N',1,'2026-05-30','2026-05-30 22:00:00.000','2026-05-31 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:37.938','2026-05-17 16:49:37.938'),
(534,'TURNO_SERV_PAR_24H_20260530_M',2,'2026-05-30','2026-05-30 06:00:00.000','2026-05-30 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.946','2026-05-17 16:49:37.946'),
(535,'TURNO_SERV_PAR_24H_20260530_T',2,'2026-05-30','2026-05-30 14:00:00.000','2026-05-30 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.959','2026-05-17 16:49:37.959'),
(536,'TURNO_SERV_PAR_24H_20260530_N',2,'2026-05-30','2026-05-30 22:00:00.000','2026-05-31 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.970','2026-05-17 16:49:37.970'),
(537,'TURNO_SERV_VET_24H_20260530_M',3,'2026-05-30','2026-05-30 06:00:00.000','2026-05-30 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.980','2026-05-17 16:49:37.980'),
(538,'TURNO_SERV_VET_24H_20260530_T',3,'2026-05-30','2026-05-30 14:00:00.000','2026-05-30 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:37.990','2026-05-17 16:49:37.990'),
(539,'TURNO_SERV_VET_24H_20260530_N',3,'2026-05-30','2026-05-30 22:00:00.000','2026-05-31 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.000','2026-05-17 16:49:38.000'),
(540,'TURNO_SERV_RE_24H_20260530_M',4,'2026-05-30','2026-05-30 06:00:00.000','2026-05-30 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.010','2026-05-17 16:49:38.010'),
(541,'TURNO_SERV_RE_24H_20260530_T',4,'2026-05-30','2026-05-30 14:00:00.000','2026-05-30 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.021','2026-05-17 16:49:38.021'),
(542,'TURNO_SERV_RE_24H_20260530_N',4,'2026-05-30','2026-05-30 22:00:00.000','2026-05-31 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.032','2026-05-17 16:49:38.032'),
(543,'TURNO_SERV_CECO_24H_20260530_M',5,'2026-05-30','2026-05-30 06:00:00.000','2026-05-30 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.043','2026-05-17 16:49:38.043'),
(544,'TURNO_SERV_CECO_24H_20260530_T',5,'2026-05-30','2026-05-30 14:00:00.000','2026-05-30 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.054','2026-05-17 16:49:38.054'),
(545,'TURNO_SERV_CECO_24H_20260530_N',5,'2026-05-30','2026-05-30 22:00:00.000','2026-05-31 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.067','2026-05-17 16:49:38.067'),
(546,'TURNO_SERV_TER_NOCTURNO_20260530_N',7,'2026-05-30','2026-05-30 22:00:00.000','2026-05-31 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.078','2026-05-17 16:49:38.078'),
(547,'TURNO_SERV_HUE_VARIABLE_20260530_M',8,'2026-05-30','2026-05-30 06:00:00.000','2026-05-30 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.088','2026-05-17 16:49:38.088'),
(548,'TURNO_SERV_HUE_VARIABLE_20260530_T',8,'2026-05-30','2026-05-30 14:00:00.000','2026-05-30 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.098','2026-05-17 16:49:38.098'),
(549,'TURNO_SERV_HUE_VARIABLE_20260530_N',8,'2026-05-30','2026-05-30 22:00:00.000','2026-05-31 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.108','2026-05-17 16:49:38.108'),
(550,'TURNO_SERV_SF_24H_20260531_M',1,'2026-05-31','2026-05-31 06:00:00.000','2026-05-31 14:00:00.000','CUBIERTO',2,'2026-05-17 16:49:38.119','2026-05-17 16:49:38.119'),
(551,'TURNO_SERV_SF_24H_20260531_T',1,'2026-05-31','2026-05-31 14:00:00.000','2026-05-31 22:00:00.000','CUBIERTO',2,'2026-05-17 16:49:38.129','2026-05-17 16:49:38.129'),
(552,'TURNO_SERV_SF_24H_20260531_N',1,'2026-05-31','2026-05-31 22:00:00.000','2026-06-01 06:00:00.000','CUBIERTO',2,'2026-05-17 16:49:38.139','2026-05-17 16:49:38.139'),
(553,'TURNO_SERV_PAR_24H_20260531_M',2,'2026-05-31','2026-05-31 06:00:00.000','2026-05-31 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.149','2026-05-17 16:49:38.149'),
(554,'TURNO_SERV_PAR_24H_20260531_T',2,'2026-05-31','2026-05-31 14:00:00.000','2026-05-31 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.159','2026-05-17 16:49:38.159'),
(555,'TURNO_SERV_PAR_24H_20260531_N',2,'2026-05-31','2026-05-31 22:00:00.000','2026-06-01 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.173','2026-05-17 16:49:38.173'),
(556,'TURNO_SERV_VET_24H_20260531_M',3,'2026-05-31','2026-05-31 06:00:00.000','2026-05-31 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.183','2026-05-17 16:49:38.183'),
(557,'TURNO_SERV_VET_24H_20260531_T',3,'2026-05-31','2026-05-31 14:00:00.000','2026-05-31 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.193','2026-05-17 16:49:38.193'),
(558,'TURNO_SERV_VET_24H_20260531_N',3,'2026-05-31','2026-05-31 22:00:00.000','2026-06-01 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.203','2026-05-17 16:49:38.203'),
(559,'TURNO_SERV_RE_24H_20260531_M',4,'2026-05-31','2026-05-31 06:00:00.000','2026-05-31 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.213','2026-05-17 16:49:38.213'),
(560,'TURNO_SERV_RE_24H_20260531_T',4,'2026-05-31','2026-05-31 14:00:00.000','2026-05-31 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.223','2026-05-17 16:49:38.223'),
(561,'TURNO_SERV_RE_24H_20260531_N',4,'2026-05-31','2026-05-31 22:00:00.000','2026-06-01 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.233','2026-05-17 16:49:38.233'),
(562,'TURNO_SERV_CECO_24H_20260531_M',5,'2026-05-31','2026-05-31 06:00:00.000','2026-05-31 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.244','2026-05-17 16:49:38.244'),
(563,'TURNO_SERV_CECO_24H_20260531_T',5,'2026-05-31','2026-05-31 14:00:00.000','2026-05-31 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.254','2026-05-17 16:49:38.254'),
(564,'TURNO_SERV_CECO_24H_20260531_N',5,'2026-05-31','2026-05-31 22:00:00.000','2026-06-01 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.264','2026-05-17 16:49:38.264'),
(565,'TURNO_SERV_TER_NOCTURNO_20260531_N',7,'2026-05-31','2026-05-31 22:00:00.000','2026-06-01 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.278','2026-05-17 16:49:38.278'),
(566,'TURNO_SERV_HUE_VARIABLE_20260531_M',8,'2026-05-31','2026-05-31 06:00:00.000','2026-05-31 14:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.288','2026-05-17 16:49:38.288'),
(567,'TURNO_SERV_HUE_VARIABLE_20260531_T',8,'2026-05-31','2026-05-31 14:00:00.000','2026-05-31 22:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.299','2026-05-17 16:49:38.299'),
(568,'TURNO_SERV_HUE_VARIABLE_20260531_N',8,'2026-05-31','2026-05-31 22:00:00.000','2026-06-01 06:00:00.000','CUBIERTO',1,'2026-05-17 16:49:38.309','2026-05-17 16:49:38.309');
/*!40000 ALTER TABLE `Turno` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `rolId` int(11) NOT NULL,
  `empresaId` int(11) DEFAULT NULL,
  `creadoEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `actualizadoEn` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Usuario_email_key` (`email`),
  KEY `Usuario_rolId_idx` (`rolId`),
  KEY `Usuario_empresaId_idx` (`empresaId`),
  CONSTRAINT `Usuario_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Usuario_rolId_fkey` FOREIGN KEY (`rolId`) REFERENCES `Rol` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES
(1,'supervision.demo@unizar.example','Supervision Demo UZ','7dbb7f051b44d7d54584a7bc6c32f00da5a3b5e6973485b9fb176fe56346b3e3',1,3,NULL,'2026-05-17 16:49:31.353','2026-05-17 16:49:31.353'),
(2,'contrata.demo@example.com','Operador Demo Contrata','7dbb7f051b44d7d54584a7bc6c32f00da5a3b5e6973485b9fb176fe56346b3e3',1,2,1,'2026-05-17 16:49:31.366','2026-05-17 16:49:31.366'),
(3,'admin.demo@example.com','Admin Demo','7dbb7f051b44d7d54584a7bc6c32f00da5a3b5e6973485b9fb176fe56346b3e3',1,1,NULL,'2026-05-17 16:49:31.382','2026-05-17 16:49:31.382');
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `VerificacionCobertura`
--

DROP TABLE IF EXISTS `VerificacionCobertura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `VerificacionCobertura` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `turnoId` int(11) NOT NULL,
  `usuarioId` int(11) NOT NULL,
  `estado` enum('CUBIERTO','INCIDENCIA','DESCUBIERTO') NOT NULL,
  `nota` text DEFAULT NULL,
  `verificadaEn` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `puestoId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `VerificacionCobertura_turnoId_idx` (`turnoId`),
  KEY `VerificacionCobertura_usuarioId_idx` (`usuarioId`),
  KEY `VerificacionCobertura_estado_idx` (`estado`),
  KEY `VerificacionCobertura_puestoId_idx` (`puestoId`),
  CONSTRAINT `VerificacionCobertura_puestoId_fkey` FOREIGN KEY (`puestoId`) REFERENCES `PuestoCobertura` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `VerificacionCobertura_turnoId_fkey` FOREIGN KEY (`turnoId`) REFERENCES `Turno` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `VerificacionCobertura_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VerificacionCobertura`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `VerificacionCobertura` WRITE;
/*!40000 ALTER TABLE `VerificacionCobertura` DISABLE KEYS */;
/*!40000 ALTER TABLE `VerificacionCobertura` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES
('88dec776-509e-4d2b-864e-55ffe0ec62aa','61f437137192f11c3afc91975a18489bfc4f459daa0fc38266baff18b302b856','2026-05-17 16:57:15.827','20260515215351_init','',NULL,'2026-05-17 16:57:15.827',0),
('91053c00-2868-49f1-aad3-8791846ec1fc','5c1f9e2273248a36346c42f5281cb1d47427e86762032fff60f1dfc46ba50725','2026-05-17 16:57:41.736','20260517190000_contrato_anual_editable','',NULL,'2026-05-17 16:57:41.736',0),
('bcee8171-75f0-4d22-bfd1-cc3a0c12d399','85d4ed3cd5812b154fd1c6aa3a4da31225e10019d5ae480b3f92413c7edbaec4','2026-05-17 16:57:28.355','20260516021500_recuperar_datos_reales_html','',NULL,'2026-05-17 16:57:28.355',0);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-17 17:24:32
