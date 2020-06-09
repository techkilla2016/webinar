<?php

require_once "../bridge/bridge.php";

$status = $_GET["status"];
$uid = $_GET["uid"];

$sql = "UPDATE registration SET Status='$status' WHERE Uid='$uid'";

if ($conn->query($sql) === TRUE) {
  echo "Record updated successfully";
} else {
  echo "Error updating record: " . $conn->error;
}

$conn->close();

?>
