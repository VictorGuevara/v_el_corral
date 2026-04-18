-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.7.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para v_el_corral
CREATE DATABASE IF NOT EXISTS `v_el_corral` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `v_el_corral`;

-- Volcando estructura para tabla v_el_corral.citas
CREATE TABLE IF NOT EXISTS `citas` (
  `id_cita` int(11) NOT NULL AUTO_INCREMENT,
  `codigo_citas` varchar(20) NOT NULL,
  `dia_cita` int(11) NOT NULL,
  `mes_cita` int(11) NOT NULL,
  `anio_cita` int(11) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `fecha_registro` date DEFAULT curdate(),
  `user_registro` varchar(50) NOT NULL,
  PRIMARY KEY (`id_cita`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.citas: ~5 rows (aproximadamente)
INSERT INTO `citas` (`id_cita`, `codigo_citas`, `dia_cita`, `mes_cita`, `anio_cita`, `nombre_cliente`, `hora_inicio`, `hora_fin`, `fecha_registro`, `user_registro`) VALUES
	(11, 'CC3577120264', 15, 4, 2026, 'Lorena Reyes', '12:00:00', '13:00:00', '2026-04-14', 'Victor Guevara'),
	(12, 'CC1715420264', 15, 4, 2026, 'Elias Molina', '17:00:00', '18:00:00', '2026-04-14', 'Victor Guevara'),
	(13, 'CC7156820265', 15, 4, 2026, 'Victor Guevara', '12:30:00', '13:59:00', '2026-04-14', 'Victor Guevara'),
	(19, 'CC7538220266', 15, 4, 2026, 'victor guevara', '12:00:00', '12:30:00', '2026-04-15', 'Victor Guevara'),
	(20, 'CC6856120267', 15, 4, 2026, 'elias molina', '13:00:00', '13:30:00', '2026-04-15', 'Victor Guevara');

-- Volcando estructura para tabla v_el_corral.diagnosticos
CREATE TABLE IF NOT EXISTS `diagnosticos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_expediente` int(11) NOT NULL,
  `dx_presuntivo` text DEFAULT NULL,
  `dx_diferencial` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_expediente` (`id_expediente`),
  CONSTRAINT `diagnosticos_ibfk_1` FOREIGN KEY (`id_expediente`) REFERENCES `expediente` (`id_expediente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.diagnosticos: ~0 rows (aproximadamente)
INSERT INTO `diagnosticos` (`id`, `id_expediente`, `dx_presuntivo`, `dx_diferencial`) VALUES
	(1, 1, 'Animal sano', 'Ninguno');

-- Volcando estructura para tabla v_el_corral.examenes
CREATE TABLE IF NOT EXISTS `examenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_expediente` int(11) NOT NULL,
  `nombre_examen` varchar(100) NOT NULL,
  `resultado` text DEFAULT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_expediente` (`id_expediente`),
  CONSTRAINT `examenes_ibfk_1` FOREIGN KEY (`id_expediente`) REFERENCES `expediente` (`id_expediente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.examenes: ~9 rows (aproximadamente)
INSERT INTO `examenes` (`id`, `id_expediente`, `nombre_examen`, `resultado`, `fecha`) VALUES
	(1, 1, 'Hemograma completo', 'Pendiente de laboratorio', '2026-04-15'),
	(2, 1, 'Examen 1', 'Resultado normal', '2026-04-11'),
	(3, 1, 'Examen 2', 'Pendiente', '2026-04-12'),
	(12, 1, 'Examen 1', 'Resultado normal', '2026-04-11'),
	(13, 1, 'Examen 1', 'Resultado normal', '2026-04-11'),
	(14, 1, 'Examen 2', 'Pendiente', '2026-04-12'),
	(15, 1, 'Examen 1', 'Resultado normal', '2026-04-11'),
	(16, 1, 'Examen 2', 'Pendiente', '2026-04-12'),
	(17, 1, 'Examen 1', 'Resultado normal', '2026-04-11'),
	(18, 1, 'Examen 2', 'Pendiente', '2026-04-12'),
	(19, 1, 'Examen 3', 'Resultado normal', '2026-04-13');

-- Volcando estructura para tabla v_el_corral.examen_fisico
CREATE TABLE IF NOT EXISTS `examen_fisico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_expediente` int(11) NOT NULL,
  `fc` varchar(50) DEFAULT NULL,
  `sonido_cardiaco` varchar(50) DEFAULT NULL,
  `fr` varchar(50) DEFAULT NULL,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `pulso` varchar(50) DEFAULT NULL,
  `reflejo_pupilar` varchar(50) DEFAULT NULL,
  `anisocoria` varchar(50) DEFAULT NULL,
  `mucosas` varchar(50) DEFAULT NULL,
  `dentadura` varchar(50) DEFAULT NULL,
  `tonsi` varchar(50) DEFAULT NULL,
  `reflejo_tusigeno` varchar(50) DEFAULT NULL,
  `tllc` varchar(50) DEFAULT NULL,
  `deshidratado` tinyint(1) DEFAULT NULL,
  `palp_abdominal` varchar(100) DEFAULT NULL,
  `palmopercusion` varchar(100) DEFAULT NULL,
  `higado` varchar(100) DEFAULT NULL,
  `rinion` varchar(100) DEFAULT NULL,
  `vejiga` varchar(100) DEFAULT NULL,
  `intestino` varchar(100) DEFAULT NULL,
  `genitales` varchar(100) DEFAULT NULL,
  `dedos` varchar(100) DEFAULT NULL,
  `condicion_corporal` varchar(100) DEFAULT NULL,
  `otras_observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_expediente` (`id_expediente`),
  CONSTRAINT `examen_fisico_ibfk_1` FOREIGN KEY (`id_expediente`) REFERENCES `expediente` (`id_expediente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.examen_fisico: ~0 rows (aproximadamente)
INSERT INTO `examen_fisico` (`id`, `id_expediente`, `fc`, `sonido_cardiaco`, `fr`, `temperatura`, `pulso`, `reflejo_pupilar`, `anisocoria`, `mucosas`, `dentadura`, `tonsi`, `reflejo_tusigeno`, `tllc`, `deshidratado`, `palp_abdominal`, `palmopercusion`, `higado`, `rinion`, `vejiga`, `intestino`, `genitales`, `dedos`, `condicion_corporal`, `otras_observaciones`) VALUES
	(1, 1, '90', NULL, '20', 38.5, 'Normal', 'Normal', NULL, 'Rosadas', 'Completa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Buena', 'Sin hallazgos relevantes');

-- Volcando estructura para tabla v_el_corral.expediente
CREATE TABLE IF NOT EXISTS `expediente` (
  `id_expediente` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `dui` varchar(15) NOT NULL,
  `motivo_consulta` text DEFAULT NULL,
  `id_mascota` int(11) NOT NULL,
  `id_propietario` int(11) NOT NULL,
  PRIMARY KEY (`id_expediente`),
  KEY `id_mascota` (`id_mascota`),
  KEY `id_propietario` (`id_propietario`),
  CONSTRAINT `expediente_ibfk_1` FOREIGN KEY (`id_mascota`) REFERENCES `mascotas` (`id`),
  CONSTRAINT `expediente_ibfk_2` FOREIGN KEY (`id_propietario`) REFERENCES `propietarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.expediente: ~0 rows (aproximadamente)
INSERT INTO `expediente` (`id_expediente`, `fecha`, `dui`, `motivo_consulta`, `id_mascota`, `id_propietario`) VALUES
	(1, '2026-04-10', '123456789', 'Consulta general de prueba', 1, 1);

-- Volcando estructura para tabla v_el_corral.expediente_historial
CREATE TABLE IF NOT EXISTS `expediente_historial` (
  `id_historial` int(11) NOT NULL AUTO_INCREMENT,
  `id_expediente` int(11) DEFAULT NULL,
  `codigo_cita` varchar(20) NOT NULL,
  `tipo_evento` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_evento` date NOT NULL,
  `user_registro` varchar(50) NOT NULL,
  PRIMARY KEY (`id_historial`),
  KEY `fk_expediente_historial` (`id_expediente`),
  CONSTRAINT `fk_expediente_historial` FOREIGN KEY (`id_expediente`) REFERENCES `expediente` (`id_expediente`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.expediente_historial: ~2 rows (aproximadamente)
INSERT INTO `expediente_historial` (`id_historial`, `id_expediente`, `codigo_cita`, `tipo_evento`, `descripcion`, `fecha_evento`, `user_registro`) VALUES
	(5, 1, 'CC7538220266', 'vacuna', 'Cita de vacuna para victor guevara', '2026-04-15', 'Victor Guevara'),
	(6, 1, 'CC6856120267', 'tratamiento', 'Cita de tratamiento para elias molina', '2026-04-15', 'Victor Guevara');

-- Volcando estructura para tabla v_el_corral.exploracion
CREATE TABLE IF NOT EXISTS `exploracion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_expediente` int(11) NOT NULL,
  `tegumentario_aspecto` varchar(100) DEFAULT NULL,
  `tegumentario_lesiones` tinyint(1) DEFAULT NULL,
  `tegumentario_alopecia` tinyint(1) DEFAULT NULL,
  `tegumentario_parasitos` tinyint(1) DEFAULT NULL,
  `musculo_movimiento` varchar(100) DEFAULT NULL,
  `digestivo_apetito` varchar(100) DEFAULT NULL,
  `digestivo_vomito` tinyint(1) DEFAULT NULL,
  `digestivo_defeca_frecuencia` varchar(50) DEFAULT NULL,
  `digestivo_defeca_color` varchar(50) DEFAULT NULL,
  `digestivo_defeca_aspecto` varchar(100) DEFAULT NULL,
  `respiratorio_tos` tinyint(1) DEFAULT NULL,
  `respiratorio_disnea` tinyint(1) DEFAULT NULL,
  `respiratorio_estornudos` tinyint(1) DEFAULT NULL,
  `respiratorio_descarga_nasal` tinyint(1) DEFAULT NULL,
  `cardiovascular_fatiga` tinyint(1) DEFAULT NULL,
  `cardiovascular_cianosis` tinyint(1) DEFAULT NULL,
  `cardiovascular_tos_nocturna` tinyint(1) DEFAULT NULL,
  `urogenital_orina` varchar(100) DEFAULT NULL,
  `urogenital_castrado` tinyint(1) DEFAULT NULL,
  `urogenital_cruzado` tinyint(1) DEFAULT NULL,
  `urogenital_gestante` tinyint(1) DEFAULT NULL,
  `urogenital_pseudociesis` varchar(100) DEFAULT NULL,
  `urogenital_ultimo_celo` date DEFAULT NULL,
  `urogenital_ultimo_parto` tinyint(1) DEFAULT NULL,
  `urogenital_descarga` tinyint(1) DEFAULT NULL,
  `nervioso_comportamiento` varchar(100) DEFAULT NULL,
  `nervioso_incoordinacion` tinyint(1) DEFAULT NULL,
  `nervioso_dismetria` tinyint(1) DEFAULT NULL,
  `nervioso_golpes_craneo` tinyint(1) DEFAULT NULL,
  `nervioso_responde_llamado` tinyint(1) DEFAULT NULL,
  `ojos_secrecion` tinyint(1) DEFAULT NULL,
  `ojos_ceguera` tinyint(1) DEFAULT NULL,
  `oidos_rasca` tinyint(1) DEFAULT NULL,
  `oidos_mal_olor` tinyint(1) DEFAULT NULL,
  `oidos_escucha` tinyint(1) DEFAULT NULL,
  `oidos_parasitos` tinyint(1) DEFAULT NULL,
  `oidos_descarga` varchar(100) DEFAULT NULL,
  `oidos_afectado` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_expediente` (`id_expediente`),
  CONSTRAINT `exploracion_ibfk_1` FOREIGN KEY (`id_expediente`) REFERENCES `expediente` (`id_expediente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.exploracion: ~0 rows (aproximadamente)
INSERT INTO `exploracion` (`id`, `id_expediente`, `tegumentario_aspecto`, `tegumentario_lesiones`, `tegumentario_alopecia`, `tegumentario_parasitos`, `musculo_movimiento`, `digestivo_apetito`, `digestivo_vomito`, `digestivo_defeca_frecuencia`, `digestivo_defeca_color`, `digestivo_defeca_aspecto`, `respiratorio_tos`, `respiratorio_disnea`, `respiratorio_estornudos`, `respiratorio_descarga_nasal`, `cardiovascular_fatiga`, `cardiovascular_cianosis`, `cardiovascular_tos_nocturna`, `urogenital_orina`, `urogenital_castrado`, `urogenital_cruzado`, `urogenital_gestante`, `urogenital_pseudociesis`, `urogenital_ultimo_celo`, `urogenital_ultimo_parto`, `urogenital_descarga`, `nervioso_comportamiento`, `nervioso_incoordinacion`, `nervioso_dismetria`, `nervioso_golpes_craneo`, `nervioso_responde_llamado`, `ojos_secrecion`, `ojos_ceguera`, `oidos_rasca`, `oidos_mal_olor`, `oidos_escucha`, `oidos_parasitos`, `oidos_descarga`, `oidos_afectado`) VALUES
	(1, 1, 'Pelaje brillante', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- Volcando estructura para tabla v_el_corral.info_adicional
CREATE TABLE IF NOT EXISTS `info_adicional` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_expediente` int(11) NOT NULL,
  `vacuna_quintuple` tinyint(1) DEFAULT NULL,
  `vacuna_triple_felina` tinyint(1) DEFAULT NULL,
  `vacuna_rabia` tinyint(1) DEFAULT NULL,
  `vacuna_parvovirus` tinyint(1) DEFAULT NULL,
  `vacuna_leucemia` tinyint(1) DEFAULT NULL,
  `vacuna_bordetella` tinyint(1) DEFAULT NULL,
  `vacuna_giardia` tinyint(1) DEFAULT NULL,
  `vacuna_otra` varchar(100) DEFAULT NULL,
  `desparasitacion_fecha` date DEFAULT NULL,
  `desparasitacion_medicamento` varchar(100) DEFAULT NULL,
  `control_garrapatas_medicamento` varchar(100) DEFAULT NULL,
  `tiempo_con_mascota` varchar(100) DEFAULT NULL,
  `otras_mascotas` tinyint(1) DEFAULT NULL,
  `habitat` varchar(100) DEFAULT NULL,
  `acceso_calle` tinyint(1) DEFAULT NULL,
  `contacto_enfermos` tinyint(1) DEFAULT NULL,
  `enfermedades_anteriores` text DEFAULT NULL,
  `dieta` text DEFAULT NULL,
  `sintomas` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `medicamentos_casa` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_expediente` (`id_expediente`),
  CONSTRAINT `info_adicional_ibfk_1` FOREIGN KEY (`id_expediente`) REFERENCES `expediente` (`id_expediente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.info_adicional: ~0 rows (aproximadamente)
INSERT INTO `info_adicional` (`id`, `id_expediente`, `vacuna_quintuple`, `vacuna_triple_felina`, `vacuna_rabia`, `vacuna_parvovirus`, `vacuna_leucemia`, `vacuna_bordetella`, `vacuna_giardia`, `vacuna_otra`, `desparasitacion_fecha`, `desparasitacion_medicamento`, `control_garrapatas_medicamento`, `tiempo_con_mascota`, `otras_mascotas`, `habitat`, `acceso_calle`, `contacto_enfermos`, `enfermedades_anteriores`, `dieta`, `sintomas`, `observaciones`, `medicamentos_casa`) VALUES
	(1, 1, 1, NULL, 1, NULL, NULL, NULL, NULL, 'Coronavirus', '2026-04-01', 'Ivermectina', 'Frontline', '3 años', NULL, 'Casa', 1, NULL, 'Ninguna', 'Concentrado premium', 'Ninguno', 'Buen estado general', 'Vitaminas');

-- Volcando estructura para tabla v_el_corral.mascotas
CREATE TABLE IF NOT EXISTS `mascotas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `especie` varchar(50) DEFAULT NULL,
  `raza` varchar(50) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `sexo` varchar(10) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `senias` text DEFAULT NULL,
  `id_propietario` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.mascotas: ~0 rows (aproximadamente)
INSERT INTO `mascotas` (`id`, `nombre`, `especie`, `raza`, `edad`, `sexo`, `peso`, `color`, `senias`, `id_propietario`) VALUES
	(1, 'Firulais', 'Canino', 'Labrador', 5, 'Macho', 25.50, 'Negro', 'Mancha blanca en el pecho', 1);

-- Volcando estructura para tabla v_el_corral.medicamentos
CREATE TABLE IF NOT EXISTS `medicamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_expediente` int(11) NOT NULL,
  `nombre_medicamento` varchar(100) NOT NULL,
  `dosis` varchar(50) DEFAULT NULL,
  `frecuencia` varchar(50) DEFAULT NULL,
  `duracion` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `via_administracion` varchar(50) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_expediente` (`id_expediente`),
  CONSTRAINT `medicamentos_ibfk_1` FOREIGN KEY (`id_expediente`) REFERENCES `expediente` (`id_expediente`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.medicamentos: ~5 rows (aproximadamente)
INSERT INTO `medicamentos` (`id`, `id_expediente`, `nombre_medicamento`, `dosis`, `frecuencia`, `duracion`, `observaciones`, `via_administracion`, `fecha_inicio`, `fecha_fin`) VALUES
	(1, 1, 'Amoxicilina', '500 mg', 'Cada 12 horas', '7 días', '', NULL, NULL, NULL),
	(2, 1, 'Medicamento 1', '100 mg', 'Cada 12 horas', '1 días', 'Sin observaciones', 'Inyectable', '2026-04-11', '2026-04-13'),
	(3, 1, 'Medicamento 2', '200 mg', 'Cada 12 horas', '2 días', 'Tomar con alimentos', 'Oral', '2026-04-12', '2026-04-14'),
	(4, 1, 'Medicamento 1', '100 mg', 'Cada 12 horas', '1 días', 'Sin observaciones', 'Inyectable', '2026-04-11', '2026-04-13'),
	(5, 1, 'Medicamento 2', '200 mg', 'Cada 12 horas', '2 días', 'Tomar con alimentos', 'Oral', '2026-04-12', '2026-04-14'),
	(6, 1, 'Medicamento 3', '300 mg', 'Cada 12 horas', '3 días', 'Sin observaciones', 'Inyectable', '2026-04-13', '2026-04-15');

-- Volcando estructura para tabla v_el_corral.menu
CREATE TABLE IF NOT EXISTS `menu` (
  `id_menu` int(11) NOT NULL,
  `url_menu` varchar(1000) NOT NULL,
  `icon_menu` varchar(100) NOT NULL,
  `name_menu` varchar(100) NOT NULL,
  `fsp_admin` int(11) NOT NULL,
  `fsp_contabilidad` int(11) NOT NULL,
  `fsp_caja` int(11) NOT NULL,
  `fsp_dependiente` int(11) NOT NULL,
  `estado_menu` int(11) NOT NULL,
  `js_menu` varchar(1000) NOT NULL,
  `css_menu` varchar(1000) NOT NULL,
  PRIMARY KEY (`id_menu`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla v_el_corral.menu: ~7 rows (aproximadamente)
INSERT INTO `menu` (`id_menu`, `url_menu`, `icon_menu`, `name_menu`, `fsp_admin`, `fsp_contabilidad`, `fsp_caja`, `fsp_dependiente`, `estado_menu`, `js_menu`, `css_menu`) VALUES
	(1, '/admin/', 'fa-solid fa-chart-area', 'panel de datos', 1, 0, 0, 0, 1, '/js/profile.js', '/css/var_colores.css'),
	(2, '/reg_citas/', 'fa-solid fa-calendar-check', 'Citas', 1, 1, 0, 0, 1, '/js/reg_citas.js', '/css/var_colores.css'),
	(3, '/expedientes/', 'fa-solid fa-folder', 'Expedientes', 1, 1, 0, 0, 1, '/js/expedientes.js', '/css/var_colores.css'),
	(81, '/notificar_citas/', 'fa-brands fa-whatsapp', 'Notificar Citas', 1, 1, 0, 0, 1, '/js/notificar_clientes.js', '/css/var_colores.css'),
	(98, '/usuarios/', 'fa-solid fa-user', 'usuarios', 1, 0, 0, 0, 1, '/js/usuarios.js', '/css/var_colores.css'),
	(99, '/signin/', 'fa-solid fa-power-off', '0', 0, 0, 0, 0, 1, '#', '/css/var_colores.css'),
	(100, '/logout/', 'fa-solid fa-power-off', 'Cerrar Sesión', 1, 1, 1, 1, 1, '#', '/css/var_colores.css');

-- Volcando estructura para tabla v_el_corral.notificaciones
CREATE TABLE IF NOT EXISTS `notificaciones` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_cita` int(11) NOT NULL,
  `telefono_cliente` varchar(20) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_programada` datetime NOT NULL,
  `estado` enum('pendiente','enviado','fallido') DEFAULT 'pendiente',
  `fecha_envio` datetime DEFAULT NULL,
  `user_registro` varchar(50) NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `fk_notificacion_cita` (`id_cita`),
  CONSTRAINT `fk_notificacion_cita` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id_cita`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.notificaciones: ~2 rows (aproximadamente)
INSERT INTO `notificaciones` (`id_notificacion`, `id_cita`, `telefono_cliente`, `mensaje`, `fecha_programada`, `estado`, `fecha_envio`, `user_registro`) VALUES
	(1, 19, '2622-0000', 'Hola victor guevara, le recordamos su cita el 15/4/2026 a las 12:00:00.', '2026-04-15 00:00:00', 'enviado', '2026-04-15 16:39:12', 'Victor Guevara'),
	(2, 20, '2622-0000', 'Hola elias molina, le recordamos su cita el 15/4/2026 a las 13:00:00.', '2026-04-15 00:00:00', 'enviado', '2026-04-15 16:41:18', 'Victor Guevara');

-- Volcando estructura para tabla v_el_corral.propietarios
CREATE TABLE IF NOT EXISTS `propietarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `dui` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.propietarios: ~0 rows (aproximadamente)
INSERT INTO `propietarios` (`id`, `nombre`, `direccion`, `correo`, `telefono`, `celular`, `dui`) VALUES
	(1, 'Juan Pérez', 'Colonia Centro, Usulután', 'juan@example.com', '2622-0000', '7777-8888', '12345678');

-- Volcando estructura para tabla v_el_corral.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.sessions: ~3 rows (aproximadamente)
INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
	('04V9BxnBdzsqhhM8nBGS60xi90oNV1AW', 1776464762, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"flash":{}}'),
	('bXn5jgBi-OOWpk2veWx_SmfaN06HD9ba', 1776464348, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"flash":{}}'),
	('eEW69BBMctV6MOUDkFZGoU5No3aXopd-', 1776465257, '{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":1},"flash":{}}');

-- Volcando estructura para tabla v_el_corral.users
CREATE TABLE IF NOT EXISTS `users` (
  `cod_users` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nombre_c` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `no_dui` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cargo` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `estado_cuenta` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sucursal_user` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`cod_users`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Volcando datos para la tabla v_el_corral.users: ~2 rows (aproximadamente)
INSERT INTO `users` (`cod_users`, `username`, `password`, `nombre_c`, `no_dui`, `cargo`, `estado_cuenta`, `sucursal_user`) VALUES
	(1, 'vic1', '$2a$10$FpMk3fRHQI1mEb6TDbdLh.r79wnUhA0I3CqpMJrHlvs7.PcN3hkmy', 'Victor Guevara', '049024156', 'Administrador', 'Activo', 'Santa Isabel'),
	(112, 'carlos1', '$2b$10$SO8/5v30qZOPgawFjCVSiuc1zKkyDbfxZAQKdLQDt5IxAYNIGWxV2', 'Carlos martines', '049024151', 'Contador', 'Activo', 'Santa Isabel');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
