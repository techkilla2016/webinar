<?php

date_default_timezone_set("Asia/Kolkata");

$name = $_POST["name"];
$email = $_POST["email"];
$pass = $_POST["pass"];
$phone = $_POST["phone"];
$company = $_POST["company"];

$uid = substr($phone,0,strlen($phone)-1);

require_once "../bridge/bridge.php";

$target_dir = "uploads/";

$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

$newName = $target_dir.sprintf( '%s.%s', date("Y-m-d-H-i-s"), $imageFileType );


$sql = "SELECT Email From registration WHERE Email='$email'";
$result = $conn->query($sql);

$flag = false;

if ($result->num_rows < 1) {
$sql = "INSERT INTO registration (Name, Password, Email,Phone,Company,Image,Status,Uid)
VALUES ('$name', '$pass', '$email','$phone','$company','$newName','0','$uid')";

if ($conn->query($sql) === TRUE) {
	$flag = true;
	
  echo "New record created successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
  
  
}
}else{
	echo "Error Email already in use";
}


// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
  $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
  if($check !== false) {
    echo "File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
  } else {
    echo "File is not an image.";
    $uploadOk = 0;
  }
}

// Check if file already exists
if (file_exists($target_file)) {
  echo "Sorry, file already exists.";
  $uploadOk = 0;
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 10000000) {
  echo "Sorry, your file is too large.";
  $uploadOk = 0;
}

// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" ) {
  echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
  $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
  echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
	if($flag === true)
	{
  if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $newName)) {
    echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";
  } else {
    echo "Sorry, there was an error uploading your file.";
  }
	}
}


$conn->close();


if($flag === true)
{
	header("Location: ../success");
}


?>