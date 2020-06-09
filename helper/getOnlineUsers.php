<?php

require_once "../bridge/bridge.php";

$data = '{"data":[';

$sql = "SELECT * FROM registration WHERE Status='1'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
	  $dt = '{"email":"'.$row["Email"].'","img":"'.$row["Image"].'","uid":"'.$row['Uid'].'"},';
	  $data.= $dt;
  }
} else {
   $data.= "[";
}

$data = substr($data,0,strlen($data)-1);

$data.= "]}";
echo $data;

$conn->close();
?>
