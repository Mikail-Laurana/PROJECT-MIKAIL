<?php
session_start();
if($_SESSION['role']!='admin'){ header("Location:../../index.php"); }
include '../../config/koneksi.php';
?>

<h2>Laporan Transaksi</h2>

<table border="1" width="100%">
<tr>
    <th>No</th>
    <th>Nama</th>
    <th>Buku</th>
    <th>Tgl Pinjam</th>
    <th>Tgl Kembali</th>
    <th>Status</th>
</tr>

<?php
$no=1;
$data = mysqli_query($conn,"
SELECT t.*, u.nama, b.judul
FROM transaksi t
JOIN users u ON t.id_user=u.id
JOIN buku b ON t.id_buku=b.id_buku
");

while($d=mysqli_fetch_assoc($data)){
?>
<tr>
<td><?= $no++ ?></td>
<td><?= $d['nama'] ?></td>
<td><?= $d['judul'] ?></td>
<td><?= $d['tanggal_pinjam'] ?></td>
<td><?= $d['tanggal_kembali'] ?? '-' ?></td>
<td><?= $d['status'] ?></td>
</tr>
<?php } ?>
</table>

<br>
<button onclick="window.print()">🖨 Cetak</button>
