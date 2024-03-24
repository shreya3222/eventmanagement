-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: event
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `bookingid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `eventid` int NOT NULL,
  `eventname` varchar(45) NOT NULL,
  `ticketprice` int NOT NULL,
  `venueid` int NOT NULL,
  `venuename` varchar(45) NOT NULL,
  `bookingtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bookingid`),
  KEY `eventid` (`eventid`),
  KEY `userid` (`userid`),
  KEY `eventname` (`eventname`),
  KEY `ticketprice` (`ticketprice`),
  KEY `venuename` (`venuename`),
  KEY `fk_booking_venue` (`venueid`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`eventid`) REFERENCES `organiser` (`eventid`),
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`),
  CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`eventname`) REFERENCES `organiser` (`eventname`),
  CONSTRAINT `booking_ibfk_4` FOREIGN KEY (`ticketprice`) REFERENCES `organiser` (`ticketprice`),
  CONSTRAINT `booking_ibfk_5` FOREIGN KEY (`venueid`) REFERENCES `venue` (`venueid`),
  CONSTRAINT `booking_ibfk_6` FOREIGN KEY (`venuename`) REFERENCES `venue` (`venuename`),
  CONSTRAINT `fk_booking_venue` FOREIGN KEY (`venueid`) REFERENCES `venue` (`venueid`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (15,1,8,'WorldTour',1000,1,'PES','2024-03-14 12:28:33'),(16,1,2,'Gajab-Cheze',400,2,'vijaynagar','2024-03-14 12:28:47'),(47,1,12,'get set go',120,2,'vijaynagar','2024-03-20 16:59:03'),(64,1,3,'bhookad',200,3,'jai nagar','2024-03-23 07:58:16');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-23 21:39:10
