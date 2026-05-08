<?php include '../../config/koneksi.php'; ?>
<h2>Data Buku</h2>
<a href="tambah_buku.php">Tambah Buku</a>
<a href="../dashboard.php">Kembali</a>
<table border="1">
<tr><th>Judul</th><th>Pengarang</th><th>Stok</th><th>Aksi</th></tr>
<?php
$data=mysqli_query($conn,"SELECT * FROM buku");
while($b=mysqli_fetch_assoc($data)){
echo "<tr>
<td>$b[judul]</td>
<td>$b[pengarang]</td>
<td>$b[stok]</td>
<td>
<a href='edit_buku.php?id=$b[id_buku]'>Edit</a> |
<a href='hapus_buku.php?id=$b[id_buku]'>Hapus</a>
</td></tr>";
}
?>
</table>
