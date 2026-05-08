<?php
session_start();
if($_SESSION['role']!= 'admin'){
    header("Location:../index.php");
}
?>

<h2>Dashboard Admin</h2>
<a href="buku/data_buku.php">Kelola Buku</a> |
<a href="transaksi/data_transaksi.php">Data Transaksi</a> |
<a href="../auth/logout.php">Logout</a> 