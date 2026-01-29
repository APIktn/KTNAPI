-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 20, 2025 at 04:42 AM
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
-- Table structure for table `tbl_mas_unit`
--

CREATE TABLE `tbl_mas_unit` (
  `UnitId` int(150) NOT NULL,
  `UnitCode` varchar(20) DEFAULT NULL,
  `UnitName` varchar(100) DEFAULT NULL,
  `UnitDetails` text,
  `UnitActive` int(1) NOT NULL DEFAULT '0',
  `CreateBy` varchar(50) DEFAULT NULL,
  `CreateDateTime` datetime DEFAULT NULL,
  `UpdateBy` varchar(50) DEFAULT NULL,
  `UpdateDateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_mas_unit`
--

INSERT INTO `tbl_mas_unit` (`UnitId`, `UnitCode`, `UnitName`, `UnitDetails`, `UnitActive`, `CreateBy`, `CreateDateTime`, `UpdateBy`, `UpdateDateTime`) VALUES
(1, 'EA', 'ชิ้น,อัน,แท่ง', 'ชิ้น,อัน,แท่ง', 1, '608050', '2025-05-20 09:28:46', '608036', '2023-12-22 16:41:05'),
(2, 'KG', 'กิโลกรัม', 'กก.', 1, '608050', '2025-05-20 09:28:55', '608036', '2024-03-25 11:19:56'),
(3, '%', 'เปอร์เซ็น', '%', 1, '608050', '2025-05-20 09:29:08', '608036', '2024-03-26 09:11:46'),
(4, 'G', 'กรัม', 'ก.', 1, '608050', '2025-05-20 09:29:13', '608036', '2024-03-26 09:12:40'),
(5, 'CASE', 'CASE', 'ลัง', 1, '608050', '2025-05-20 09:40:09', '608036', '2025-02-25 15:16:05'),
(6, 'TON', 'TON', 'ตัน', 1, '608050', '2025-05-20 09:29:26', '608036', '2025-02-25 15:16:12'),
(7, 'THB', 'THB', 'บาท', 1, '608050', '2025-05-20 09:29:31', '608036', '2025-02-27 15:01:25'),
(8, 'mm', 'มิลลิเมตร', 'มม.', 1, '608050', '2025-05-20 09:30:45', '608050', '2025-05-20 09:30:12'),
(9, 'cm', 'เซนติเมตร', 'ซม.', 1, '608050', '2025-05-20 09:30:39', '608050', '2025-05-20 09:30:39'),
(10, 'm', 'เมตร', 'ม.', 1, '608050', '2025-05-20 09:31:13', '608050', '2025-05-20 09:31:13'),
(11, 'mm²', 'ตารางมิลลิเมตร', 'ตร.มม.', 1, '608050', '2025-05-20 09:32:35', '608050', '2025-05-20 09:32:35'),
(12, 'cm²', 'ตารางเซนติเมตร', 'ตร.ซม.', 1, '608050', '2025-05-20 09:32:59', '608050', '2025-05-20 09:32:59'),
(13, 'm²', 'ตารางเมตร', 'ตร.ม.', 1, '608050', '2025-05-20 09:33:15', '608050', '2025-05-20 09:33:15'),
(14, 'mm³', 'ลูกบาศก์มิลลิเมตร', 'ลบ.มม.', 1, '608050', '2025-05-20 09:35:32', '608050', '2025-05-20 09:35:32'),
(15, 'cm³', 'ลูกบาศก์เซนติเมตร', 'ลบ.ซม.', 1, '608050', '2025-05-20 09:35:52', '608050', '2025-05-20 09:35:52'),
(16, 'm³', 'ลูกบาศก์เมตร', 'ลบ.ม.', 1, '608050', '2025-05-20 09:36:04', '608050', '2025-05-20 09:36:04'),
(17, 'ml', 'มิลลิลิตร', 'มล.', 1, '608050', '2025-05-20 09:37:00', '608050', '2025-05-20 09:37:00'),
(18, 'l', 'ลิตร', 'ล.', 1, '608050', '2025-05-20 09:37:16', '608050', '2025-05-20 09:37:16'),
(19, 'bag', 'ถุง', 'ถุง', 1, '608050', '2025-05-20 09:38:28', '608050', '2025-05-20 09:38:28'),
(20, 'sack', 'กระสอบ', 'กระสอบ', 1, '608050', '2025-05-20 09:38:44', '608050', '2025-05-20 09:38:44'),
(21, 'bottle', 'ขวด', 'ขวด', 1, '608050', '2025-05-20 09:39:02', '608050', '2025-05-20 09:39:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_mas_unit`
--
ALTER TABLE `tbl_mas_unit`
  ADD PRIMARY KEY (`UnitId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_mas_unit`
--
ALTER TABLE `tbl_mas_unit`
  MODIFY `UnitId` int(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
