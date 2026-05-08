<?php
    include "../config/koneksi.php";
    session_start();
    if($_SESSION['role']!= 'user' ){
        header("Location:../index.php");
    }
?>

<h2>Data Buku</h2>
<a href="dashboard.php">Kembali</a>
<table border="1">
    <tr>
        <th>Judul</th>
        <th>Pengarang</th>
        <th>Stok</th>
        <th>Aksi</th>
    </tr>
    <?php
        $data = mysqli_query($conn,"SELECT * FROM buku");
        while($b = mysqli_fetch_assoc($data)){
            echo "<tr>
                <td>$b[judul]</td>
                <td>$b[pengarang]</td>
                <td>$b[stok]</td>
                <td>
                    <a href='pinjam_buku.php?id=$b[id_buku]'>Pinjam</a> |
                </td></tr>" ;
        }
    ?>
</table>

