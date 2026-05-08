<?php
session_start();
include "../config/koneksi.php";
$id = $_SESSION['id'];
$data=mysqli_query($conn,"SELECT t.*,b.judul FROM transaksi t JOIN buku b ON t.id_buku = b.id_buku WHERE id_user = '$id'");
?>

<h2>Data Buku</h2>
<table border="1">
    <tr>
        <th>Judul</th>
        <th>Pengarang</th>
        <th>Aksi</th>
    </tr>
<?php while($b=mysqli_fetch_assoc($data)) {?>
    <tr>
        <td><?= $b['judul']?></td>
        <td><?= $b['status']?></td>
        <td>
            <?php if($b['status'] == 'dipinjam') {?>
                <a href="kembali_buku.php?id=<?=$b['id_transaksi']?>">Kembalikan</a>
            <?php }?>
        </td>
    </tr>
<?php } ?>
</table>

<a href="dashboard.php">Kembali</a>