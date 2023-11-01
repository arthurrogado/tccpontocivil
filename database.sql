/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `pontocivil` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `pontocivil`;

CREATE TABLE IF NOT EXISTS `colaboradores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `valor_diaria` int(11) DEFAULT 10000 COMMENT 'em centavos',
  `funcao` varchar(100) DEFAULT NULL,
  `observacoes` varchar(100) DEFAULT NULL,
  `id_escritorio` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `FK_colaboradores_escritorios` (`id_escritorio`),
  CONSTRAINT `FK_colaboradores_escritorios` FOREIGN KEY (`id_escritorio`) REFERENCES `escritorios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `colaboradores_obras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_colaborador` int(11) NOT NULL DEFAULT 0,
  `id_obra` int(11) NOT NULL DEFAULT 0,
  `arquivado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK__colaboradores` (`id_colaborador`),
  KEY `FK__obras` (`id_obra`),
  CONSTRAINT `FK__colaboradores` FOREIGN KEY (`id_colaborador`) REFERENCES `colaboradores` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK__obras` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `composicoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL DEFAULT 0,
  `descricao` varchar(255) NOT NULL DEFAULT '',
  `unidade` varchar(10) NOT NULL COMMENT '2023-09',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=22660 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `composicoes_insumos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL DEFAULT 0,
  `descricao` varchar(255) NOT NULL DEFAULT '',
  `unidade` varchar(10) NOT NULL COMMENT '2023-09',
  `tipo` enum('C','I') NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `codigo` (`codigo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22660 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `custos_adicionais` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `valor` double NOT NULL DEFAULT 0,
  `data` date NOT NULL,
  `id_obra` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_custos_adicionais_obras` (`id_obra`),
  CONSTRAINT `FK_custos_adicionais_obras` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `detalhes_composicoes_insumos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL COMMENT 'codigo vindo da sinapi',
  `estado_referencia` varchar(2) NOT NULL,
  `mes_referencia` date NOT NULL,
  `desonerado` tinyint(1) NOT NULL DEFAULT 0,
  `valor` float NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_detalhes_composicoes_composicoes` (`codigo`) USING BTREE,
  CONSTRAINT `FK_detalhes_composicoes_insumos_composicoes_insumos` FOREIGN KEY (`codigo`) REFERENCES `composicoes_insumos` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22660 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `escritorios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `cnpj` varchar(50) DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `endereco` varchar(50) DEFAULT NULL,
  `observacoes` varchar(255) DEFAULT NULL,
  `deletado` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `etapas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `id_orcamento` int(11) NOT NULL,
  `id_proxima_etapa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_etapas_etapas` (`id_proxima_etapa`) USING BTREE,
  KEY `FK_etapas_orcamentos` (`id_orcamento`),
  CONSTRAINT `FK_etapas_etapas` FOREIGN KEY (`id_proxima_etapa`) REFERENCES `etapas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_etapas_orcamentos` FOREIGN KEY (`id_orcamento`) REFERENCES `orcamentos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `insumos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL DEFAULT 0,
  `descricao` varchar(255) NOT NULL DEFAULT '0',
  `unidade` varchar(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `itens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL,
  `quantidade` float NOT NULL,
  `tipo` enum('i','c') NOT NULL COMMENT 'i ou c',
  `id_etapa` int(11) NOT NULL,
  `id_proximo_item` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orcamento_itens_orcamentos_etapas` (`id_etapa`),
  KEY `FK_orcamento_itens_orcamento_itens` (`id_proximo_item`) USING BTREE,
  CONSTRAINT `FK_itens_itens` FOREIGN KEY (`id_proximo_item`) REFERENCES `itens` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_orcamento_itens_orcamentos_etapas` FOREIGN KEY (`id_etapa`) REFERENCES `etapas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `obras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL DEFAULT '',
  `descricao` varchar(255) NOT NULL DEFAULT '',
  `id_escritorio` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_obras_escritorios` (`id_escritorio`),
  CONSTRAINT `FK_obras_escritorios` FOREIGN KEY (`id_escritorio`) REFERENCES `escritorios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `orcamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(80) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(2) NOT NULL COMMENT 'Ex.: GO',
  `data_sinapi` varchar(7) NOT NULL COMMENT 'YYYY-MM',
  `bdi` float DEFAULT 0,
  `desonerado` tinyint(4) DEFAULT 0,
  `id_pasta` int(11) DEFAULT NULL,
  `id_escritorio` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orcamentos_escritorios` (`id_escritorio`),
  CONSTRAINT `FK_orcamentos_escritorios` FOREIGN KEY (`id_escritorio`) REFERENCES `escritorios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `pastas_orcamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(80) NOT NULL DEFAULT '0',
  `descricao` varchar(255) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `id_escritorio` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `pontos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_colaborador` int(11) NOT NULL,
  `id_obra` int(11) NOT NULL,
  `data` date NOT NULL,
  `matutino` tinyint(1) NOT NULL,
  `vespertino` tinyint(1) NOT NULL,
  `valor_diaria` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_pontos_colaboradores` (`id_colaborador`),
  KEY `FK_pontos_obras` (`id_obra`),
  CONSTRAINT `FK_pontos_colaboradores` FOREIGN KEY (`id_colaborador`) REFERENCES `colaboradores` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_pontos_obras` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `categoria` varchar(50) NOT NULL DEFAULT 'funcionario',
  `cpf` varchar(50) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `id_escritorio` int(11) DEFAULT NULL,
  `arquivado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `FK_usuarios_escritorio` (`id_escritorio`),
  CONSTRAINT `FK_usuarios_escritorio` FOREIGN KEY (`id_escritorio`) REFERENCES `escritorios` (`id`) ON DELETE NO ACTION ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
