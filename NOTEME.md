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

PORT=5000

DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=ktnapi
DB_PORT=3306