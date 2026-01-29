-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 20, 2025 at 04:39 AM
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
-- Table structure for table `tbl_trs_material_receive_doc_header`
--

CREATE TABLE `tbl_trs_material_receive_doc_header` (
  `Id` int(150) NOT NULL,
  `NumberDoc` varchar(20) NOT NULL,
  `DocDate` text NOT NULL,
  `StatusDoc` int(1) NOT NULL,
  `PO` varchar(150) NOT NULL,
  `CategoryCode` varchar(10) NOT NULL,
  `MenuDeptCode` varchar(10) NOT NULL,
  `CompanyCode` varchar(10) NOT NULL,
  `CreateBy` varchar(10) NOT NULL,
  `CreateDateTime` datetime NOT NULL,
  `UpdateBy` varchar(10) NOT NULL,
  `UpdateDateTime` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_trs_material_receive_doc_header`
--
ALTER TABLE `tbl_trs_material_receive_doc_header`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_trs_material_receive_doc_header`
--
ALTER TABLE `tbl_trs_material_receive_doc_header`
  MODIFY `Id` int(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
