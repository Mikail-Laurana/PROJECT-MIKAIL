<?php
    session_start();
    if($_SESSION['role'] != 'admin'){
        heade("Location:../index.php");
    } 
?>

<h2>Halo <?= $_SESSION['nama']?></h2>
<a href="buku/data_buku.php">Data Buku</a> |
<a href="transaksi/data_transaksi.php">Data Transaksi</a> |
<a href="../auth/logout.php">Logout</a>
