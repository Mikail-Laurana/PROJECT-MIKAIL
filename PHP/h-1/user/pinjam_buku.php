<?php
    session_start();
    include "../config/koneksi.php";

    $id_user = $_SESSION['id'];
    $id_buku = $_GET['id'];

    mysqli_query($conn,"INSERT into transaksi (id_user,id_buku,tanggal_pinjam) VALUES ('$id_user','$id_buku', CURDATE())");
    mysqli_query($conn,"UPDATE buku SET stok = stok-1 WHERE id_buku='$id_buku'");

    header("Location: data_buku.php");
?>