CREATE DATABASE  IF NOT EXISTS `iskconmy_folk` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `iskconmy_folk`;
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: iskconmy_folk
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `calendar`
--

DROP TABLE IF EXISTS `calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar` (
  `eventId` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `date` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `program` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` mediumtext COLLATE utf8mb4_general_ci,
  `venue` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `speaker` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`eventId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `compute`
--

DROP TABLE IF EXISTS `compute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compute` (
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `attendance` int DEFAULT NULL,
  `sosAttendance` int DEFAULT NULL,
  `folk2Attendance` int DEFAULT NULL,
  `folk4Attendance` int DEFAULT NULL,
  `lastSeen` int DEFAULT NULL,
  `regularity` float DEFAULT NULL,
  `status` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activeness` float DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participants` (
  `username` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `program` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dob` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `snoozeDate` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isStudent` tinyint DEFAULT NULL,
  `callNotAvailable` tinyint DEFAULT '0',
  `whatsAppNotAvailable` tinyint DEFAULT '0',
  `yearOfJoining` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `institution` mediumtext COLLATE utf8mb4_general_ci,
  `course` mediumtext COLLATE utf8mb4_general_ci,
  `company` mediumtext COLLATE utf8mb4_general_ci,
  `highestQualification` mediumtext COLLATE utf8mb4_general_ci,
  `designation` mediumtext COLLATE utf8mb4_general_ci,
  `tShirtSize` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `skills` longtext COLLATE utf8mb4_general_ci,
  `comments` longtext COLLATE utf8mb4_general_ci,
  `dateAdded` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `addedBy` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `preacher` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `buddy` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `source` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(45) COLLATE utf8mb4_general_ci DEFAULT 'General',
  `batch` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `native` mediumtext COLLATE utf8mb4_general_ci,
  `pass` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `participation`
--

DROP TABLE IF EXISTS `participation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participation` (
  `eventId` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `caller` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `response` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `remarks` longtext COLLATE utf8mb4_general_ci,
  `attendance` tinyint DEFAULT NULL,
  `time` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  UNIQUE KEY `uc_compound_key` (`eventId`,`name`,`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `id` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prospects`
--

DROP TABLE IF EXISTS `prospects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prospects` (
  `id` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `program` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isStudent` tinyint DEFAULT NULL,
  `callNotAvailable` tinyint DEFAULT '0',
  `whatsAppNotAvailable` tinyint DEFAULT '0',
  `yearOfJoining` int DEFAULT NULL,
  `institution` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `highestQualification` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `designation` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `skills` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `comments` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateAdded` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `addedBy` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `source` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `batch` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `date` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `program` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `paid` tinyint DEFAULT NULL,
  `paymentMode` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `paymentReference` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `meta` json DEFAULT NULL,
  UNIQUE KEY `rc_compound_key` (`program`,`name`,`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `username` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `roleIndex` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `roleID` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `roleName` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `program` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `message` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `canvaLink` mediumtext COLLATE utf8mb4_general_ci,
  `posterLink` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  UNIQUE KEY `sc_compound_key` (`program`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `addedBy` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `addedDate` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pass` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-27 13:04:16
