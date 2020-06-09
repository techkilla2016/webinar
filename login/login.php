<?php

$email = $_GET["username"];
$pass = $_GET["pass"];

$uid = "";
$name = "";

$flag = false;

require_once "../bridge/bridge.php";

$sql = "SELECT Name,Email,Image,Password,Uid FROM registration WHERE Email='$email' AND Password='$pass'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
    $uid  = $row['Uid'];
	$name = $row['Name']; 
	$img  = $row['Image'];
  }
  $flag = true;

  $sql = "UPDATE registration SET Status='1' WHERE Email='$email'";
  $conn->query($sql);
  
  echo '{"status":1,"name":"'.$name.'","uid":"'.$uid.'","imageURL":"'.$img  .'"}';
} else {
  echo '{"status":0,"name":"null","uid":null}';
}

$conn->close();


?>