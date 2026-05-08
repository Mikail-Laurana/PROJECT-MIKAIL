<?php
include "../config/koneksi.php";
$id=$_GET['id'];

mysqli_query($conn,"UPDATE transaksi SET status='kembali',tanggal_kembali=CURDATE() where id_transaksi = '$id'");
$d = mysqli_fetch_assoc(mysqli_query($conn,"SELECT id_buku FROM transaksi where id_transaksi='$id'"));
mysqli_query($conn,"UPDATE buku SET stok=stok+1 where id_buku='".$d['id_buku']."'");

header("Location:riwayat.php");
?>