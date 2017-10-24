SET NAMES utf8;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `myapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `fb_user`
--

DROP TABLE IF EXISTS `fb_user`;
CREATE TABLE `fb_user` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `roles` varchar(50) NOT NULL DEFAULT '' COMMENT 'role',
  `age` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `birthday` datetime DEFAULT NULL,
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `status` (`status`),
  KEY `ctime` (`ctime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='user';

DROP TABLE IF EXISTS `fb_test`;
CREATE TABLE `fb_test` (
  `id` int(11) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `content` text DEFAULT NULL,
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `version` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `subject` (`subject`),
  KEY `status` (`status`),
  KEY `ctime` (`ctime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='test';
