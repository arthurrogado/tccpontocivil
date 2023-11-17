/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `composicoes_insumos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `unidade` varchar(10) NOT NULL COMMENT '2023-09',
  `tipo` enum('C','I') NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `codigo` (`codigo`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=54581 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `detalhes_composicoes_insumos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL COMMENT 'codigo vindo da sinapi',
  `estado_referencia` varchar(2) NOT NULL,
  `mes_referencia` date NOT NULL,
  `desonerado` enum('0','1') NOT NULL DEFAULT '0',
  `valor` float NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_detalhes_composicoes_composicoes` (`codigo`) USING BTREE,
  CONSTRAINT `FK_detalhes_composicoes_insumos_composicoes_insumos` FOREIGN KEY (`codigo`) REFERENCES `composicoes_insumos` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24975 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `escritorios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `cnpj` varchar(50) DEFAULT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `endereco` varchar(50) DEFAULT NULL,
  `observacoes` varchar(255) DEFAULT NULL,
  `deletado` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `etapas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(255) NOT NULL,
  `id_orcamento` int(11) NOT NULL,
  `id_proxima_etapa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_etapas_etapas` (`id_proxima_etapa`) USING BTREE,
  KEY `FK_etapas_orcamentos` (`id_orcamento`),
  CONSTRAINT `FK_etapas_etapas` FOREIGN KEY (`id_proxima_etapa`) REFERENCES `etapas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_etapas_orcamentos` FOREIGN KEY (`id_orcamento`) REFERENCES `orcamentos` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `itens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` int(11) NOT NULL,
  `quantidade` float NOT NULL,
  `tipo` enum('i','c') NOT NULL COMMENT 'i ou c',
  `id_etapa` int(11) NOT NULL,
  `id_proximo_item` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orcamento_itens_orcamento_itens` (`id_proximo_item`) USING BTREE,
  KEY `FK_itens_composicoes_insumos` (`codigo`),
  KEY `FK_itens_etapas` (`id_etapa`),
  CONSTRAINT `FK_itens_composicoes_insumos` FOREIGN KEY (`codigo`) REFERENCES `composicoes_insumos` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_itens_etapas` FOREIGN KEY (`id_etapa`) REFERENCES `etapas` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_itens_itens` FOREIGN KEY (`id_proximo_item`) REFERENCES `itens` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `orcamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(80) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(2) NOT NULL COMMENT 'Ex.: GO',
  `data_sinapi` date NOT NULL COMMENT '2023-09-01',
  `bdi` float DEFAULT 0,
  `desonerado` enum('0','1') DEFAULT NULL,
  `id_pasta` int(11) DEFAULT NULL,
  `id_escritorio` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orcamentos_escritorios` (`id_escritorio`),
  CONSTRAINT `FK_orcamentos_escritorios` FOREIGN KEY (`id_escritorio`) REFERENCES `escritorios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `pastas_orcamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(80) NOT NULL DEFAULT '0',
  `descricao` varchar(255) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `id_escritorio` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;


-- Dados básicos para o usuário MASTER

INSERT INTO `escritorios` (`id`, `nome`, `cnpj`, `telefone`, `endereco`, `observacoes`, `deletado`) VALUES (1, '[TESTE ADM]', '123', NULL, NULL, NULL, 0);

INSERT INTO `usuarios` (`id`, `nome`, `usuario`, `senha`, `categoria`, `cpf`, `telefone`, `id_escritorio`, `arquivado`) VALUES (1, 'ADM - MASTER', 'master', '$10$pDX6RrSXplDkLAo/x/2dyevhtaPksO56xgiJyHkeC2Ybkwe/BIq9q', 'ADM', NULL, NULL, 1, 0);
