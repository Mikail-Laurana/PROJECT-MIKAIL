<?php
include '../../config/koneksi.php';
mysqli_query($conn,"DELETE FROM buku WHERE id_buku='$_GET[id]'");
header("Location:data_buku.php");
?>