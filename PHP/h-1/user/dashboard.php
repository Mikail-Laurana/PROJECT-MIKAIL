<?php
    session_start();
    include "../config/koneksi.php";
    if($_SESSION['role']!= 'user' ){
        header("Location:../index.php");
    }
    
?>

<h2>Halo <?= $_SESSION['nama']?></h2>
<a href="data_buku.php">Lihat Buku</a> |
<a href="riwayat.php">Riwayat Peminjaman Buku</a> |
<a href="../auth/logout.php">Logout</a>