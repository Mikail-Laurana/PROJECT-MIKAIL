<?php
    session_start();
    if($_SESSION['role'] != 'user'){
        header("Location:../index.php");
    }
?>

<h2>Halo <?php $_SESSION['nama']?></h2>
<a href="lihat_buku.php">Lihat Buku</a> |
<a href="riwayat.php">Riwayat</a> |
<a href="../auth/logout.php">Logout</a> 