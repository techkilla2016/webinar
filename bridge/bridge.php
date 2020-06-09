<?php

$servername = "localhost";
$username = "u982311836_techkilla";
$password = "HelloMac@123";
$dbname = "u982311836_techkilla";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

?>