-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 20, 2025 at 04:40 AM
-- Server version: 5.7.17-log
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chaosuawebapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_trs_material_receive_doc`
--

CREATE TABLE `tbl_trs_material_receive_doc` (
  `Id` int(150) NOT NULL,
  `CompanyCode` varchar(10) NOT NULL,
  `MatCode` varchar(150) NOT NULL,
  `MatDescription` varchar(150) NOT NULL,
  `MatReceiveDate` text NOT NULL,
  `ShelfLife` int(150) NOT NULL,
  `Supplier` varchar(150) NOT NULL,
  `Amount1` decimal(10,2) NOT NULL,
  `Amount2` decimal(10,2) NOT NULL,
  `Amount3` decimal(10,2) NOT NULL,
  `Amount4` decimal(10,2) NOT NULL,
  `Unit1` varchar(150) NOT NULL,
  `Unit2` varchar(150) NOT NULL,
  `Unit3` varchar(150) NOT NULL,
  `Unit4` varchar(150) NOT NULL,
  `MFD` text NOT NULL,
  `EXP` text NOT NULL,
  `MatWL` decimal(10,2) NOT NULL,
  `MatT` decimal(10,2) NOT NULL,
  `MatWeight` decimal(10,2) NOT NULL,
  `MatAmount` decimal(10,2) NOT NULL,
  `MatMois` decimal(10,2) NOT NULL,
  `CheckTransport` text NOT NULL,
  `CheckPest` text NOT NULL,
  `CheckQuality` text NOT NULL,
  `CheckCOA` text NOT NULL,
  `CheckProcess` text NOT NULL,
  `HeaderId` int(150) NOT NULL,
  `CreateBy` varchar(10) NOT NULL,
  `CreateDateTime` datetime NOT NULL,
  `UpdateBy` varchar(10) NOT NULL,
  `UpdateDateTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_trs_material_receive_doc`
--
ALTER TABLE `tbl_trs_material_receive_doc`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `fk_material_receive_header` (`HeaderId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_trs_material_receive_doc`
--
ALTER TABLE `tbl_trs_material_receive_doc`
  MODIFY `Id` int(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_trs_material_receive_doc`
--
ALTER TABLE `tbl_trs_material_receive_doc`
  ADD CONSTRAINT `fk_material_receive_header` FOREIGN KEY (`HeaderId`) REFERENCES `tbl_trs_material_receive_doc_header` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
