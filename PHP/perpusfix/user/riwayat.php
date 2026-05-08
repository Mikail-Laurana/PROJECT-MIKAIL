<?php
session_start();
include "../config/koneksi.php";

$id=$_SESSION['id'];

$data=mysqli_query($conn,"SELECT t.*,b.judul FROM transaksi t JOIN buku b ON t.id_buku=b.id_buku WHERE id_user='$id'");

?>

<table border="1">
    <tr>
        <th>Buku</th>
        <th>Status</th>
        <th>Aksi</th>
    </tr>

    <?php while($d =mysqli_fetch_assoc($data)) {?>
        <tr>
            <td><?=$d['judul']?></td>
            <td><?=$d['status']?></td>
            <td>
                <?php if($d['status']== 'dipinjam'){?>
                <a href="kembali.php?id=<?= $d['id_transaksi']?>">Kembalikan</a>
                <?php }?>
            </td>
        </tr>
    <?php } ?>
    
</table>