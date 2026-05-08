<?php
session_start();
if($_SESSION['role'] != 'user'){
    header("Location:../index.php");
}
?>

<h2>Halo, <?= $_SESSION['nama'] ?></h2>
<?php 
    include '../config/koneksi.php'; 
?>
<h2>Data Buku</h2>
<table border="1">
    <tr>
        <th>Judul</th>
        <th>Pengarang</th>
        <th>Stok</th>
        <th>Aksi</th>
    </tr>
<?php
    $data=mysqli_query($conn,"SELECT * FROM buku");
    while($b=mysqli_fetch_assoc($data)){
    echo "<tr>
        <td>$b[judul]</td>
        <td>$b[pengarang]</td>
        <td>$b[stok]</td>
        <td>
        <a href='pinjam.php?id=$b[id_buku]'>Pinjam</a> |
        </td></tr>";
    }
?>
</table>

<a href="riwayat.php">Riwayat</a>
<a href="../auth/logout.php">Logout</a>