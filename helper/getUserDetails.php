<?php

$uid = $_GET["uid"];

require_once "../bridge/bridge.php";

$sql = "SELECT * FROM registration WHERE Uid='$uid'";
$result = $conn->query($sql);
$data = '{';

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $data.= '"name":"'.$row['Name'].'","company":"'.$row['Company'].'","img":"'.$row['Image'].'"';
  }
} else {
  echo "0 results";
}

$data .= "}";

echo $data;

$conn->close();
?>
