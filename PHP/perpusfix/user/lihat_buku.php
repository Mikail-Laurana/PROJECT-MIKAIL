<?php
    session_start();
    include "../config/koneksi.php";
?>

<h2>Tabel Buku</h2>
<table border="1">
    <tr>
        <th>Judul</th>
        <th>Stok</th>
        <th>Aksi</th>
    </tr>
    <?php
        $data=mysqli_query($conn,"SELECT * FROM buku WHERE stok> 0");
        while($b=mysqli_fetch_assoc($data)){
            echo
            "<tr>
                <td>$b[judul]</td>
                <td>$b[stok]</td>
                <td><a href='pinjam.php?id=$b[id_buku]'>PINJAM</a></td>
            </tr>";
        }
    ?>
</table>

