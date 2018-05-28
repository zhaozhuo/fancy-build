SET NAMES utf8;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Table structure for table `fancy_user`
--
DROP TABLE IF EXISTS `fancy_user`;
CREATE TABLE `fancy_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `roles` varchar(200) NOT NULL DEFAULT '',
  `age` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `birthday` datetime DEFAULT NULL,
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `valid` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `ctime` (`ctime`),
  KEY `valid` (`valid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='user';

DROP TABLE IF EXISTS `fancy_test`;
CREATE TABLE `fancy_test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(200) NOT NULL,
  `content` text DEFAULT NULL,
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `valid` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `subject` (`subject`),
  KEY `ctime` (`ctime`),
  KEY `valid` (`valid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='test';

INSERT INTO `fancy_user` (`name`, `roles`, `age`, `birthday`, `ctime`, `utime`, `version`, `valid`) VALUES
('张三', '1', '23', NULL, now(), now(), '0', '1'),
('李四', '1', '24', NULL, now(), now(), '0', '1'),
('王五', '1', '25', NULL, now(), now(), '0', '1');

