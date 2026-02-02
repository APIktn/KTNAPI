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
  `Profile_Image` text NOT NULL,
  `Upload_Image` text,
  `Upload_Image_Id` text NOT NULL,
  `CreateBy` varchar(20) NOT NULL,
  `CreateDateTime` datetime NOT NULL,
  `UpdateBy` varchar(20) NOT NULL,
  `UpdateDateTime` datetime NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `uq_usercode` (`UserCode`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ktnapi.tbl_trs_product_header definition

CREATE TABLE `tbl_trs_product_header` (
  `Id` int(150) NOT NULL AUTO_INCREMENT,
  `ProductCode` varchar(150) NOT NULL,
  `ProductName` varchar(255) NOT NULL,
  `ProductDes` text NOT NULL,
  `CreateBy` varchar(20) NOT NULL,
  `CreateDateTime` datetime NOT NULL,
  `UpdateBy` int(20) NOT NULL,
  `UpdateDateTime` datetime NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ktnapi.tbl_trs_product_image definition

CREATE TABLE `tbl_trs_product_image` (
  `Id` int(150) NOT NULL,
  `IdRef` int(150) NOT NULL,
  `ImageType` varchar(50) NOT NULL,
  `ProductImage` text NOT NULL,
  `ProductImageId` text NOT NULL,
  `CreateBy` varchar(20) NOT NULL,
  `CreateDateTime` date NOT NULL,
  `UpdateBy` varchar(20) NOT NULL,
  `UpdateDateTime` date NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_product_image_header` (`IdRef`),
  CONSTRAINT `fk_product_image_header` FOREIGN KEY (`IdRef`) REFERENCES `tbl_trs_product_header` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ktnapi.tbl_trs_product_line definition

CREATE TABLE `tbl_trs_product_line` (
  `Id` int(150) NOT NULL AUTO_INCREMENT,
  `IdRef` int(150) NOT NULL,
  `LineNo` int(150) NOT NULL,
  `Size` varchar(150) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Amount` int(10) NOT NULL,
  `Note` text NOT NULL,
  `CreateBy` varchar(20) NOT NULL,
  `CreateDateTime` datetime NOT NULL,
  `UpdateBy` varchar(20) NOT NULL,
  `UpdateDateTime` datetime NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_product_line_header` (`IdRef`),
  CONSTRAINT `fk_product_line_header` FOREIGN KEY (`IdRef`) REFERENCES `tbl_trs_product_header` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;