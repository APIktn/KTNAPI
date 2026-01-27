// แก้ vs code
C:\Users\<username>\AppData\Roaming\Code\User\settings.json

// connection pool
.env
PORT=5000

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=ktnapi
DB_PORT=3306
BASE_URL=http://localhost  // local dev uat production

// db ktnapi sql

CREATE DATABASE `ktnapi` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

-- ktnapi.tbl_mas_users definition

CREATE TABLE `tbl_mas_users` (
  `Id` int(150) NOT NULL AUTO_INCREMENT,
  `UserCode` varchar(20) NOT NULL,
  `UserName` varchar(150) DEFAULT NULL,
  `UserEmail` varchar(150) NOT NULL,
  `Password` varchar(150) NOT NULL,
  `FirstName` varchar(150) NOT NULL,
  `LastName` varchar(150) NOT NULL,
  `Address` text NOT NULL,
  `Tel` varchar(20) NOT NULL,
  `VerifyEmail` text NOT NULL,
  `Profile_Image` blob NOT NULL,
  `CreateBy` varchar(10) NOT NULL,
  `CreateDateTime` datetime NOT NULL,
  `UpdateBy` varchar(10) NOT NULL,
  `UpdateDateTime` datetime NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `uq_usercode` (`UserCode`),
  UNIQUE KEY `uq_username` (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

