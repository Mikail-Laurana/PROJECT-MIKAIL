<?php
include '../config/koneksi.php';
$nama=$_POST['nama'];
$user=$_POST['username'];
$pass=md5($_POST['password']);

mysqli_query($conn,"INSERT INTO users (nama,username,password,role) VALUES ('$nama','$user','$pass','user')");
header("Location: ../index.php");
?>