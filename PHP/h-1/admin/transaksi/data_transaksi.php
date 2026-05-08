<?php
    include "../config/koneksi.php";
    session_start();
    if($_SESSION['role']!= 'admin' ){
        header("Location:../index.php");
    }

    $cari = $_GET['cari'] ?? '';
?>


<h2>Data Transaksi Peminjaman</h2>

<form action="" method="get">
    <input type="text" name="cari" placeholder="Cari Nama / Judul Buku" value= "<?= $cari?>">
    <button>Cari</button>
</form>
<a href="dashboard.php">Kembali</a>
<table border="1" width="100%">
    <tr>
        <th>No</th>
        <th>Nama Siswa</th>
        <th>Judul Buku</th>
        <th>Tanggal Pinjam</th>
        <th>Tanggal Kembali</th>
        <th>Status</th>
        <th>Aksi</th>
    </tr>
    <?php
        $no = 1;
        $data = mysqli_query($conn,"SELECT t.*, u.nama b.judul FROM transaksi t JOIN users u ON t.id_user = u.id JOIN buku b t.id_buku = b.id_buku WHERE u.nama LIKE '%$cari%' OR b.judul LIKE '%$cari%' ORDER BY t.id transaksi DESC");
        while($b = mysqli_fetch_assoc($data)){?>
            <tr>
                <td><?=$no++?></td>
                <td><?= $b['nama']?></td>
                <td><?=$b['judul']?></td>
                <td><?=$b['tanggal_pinjam']?></td>
                <td><?=$b['tanggal_kembali'] ?? '-'?></td>
                <td><?=$b['status']?></td>
                <td>
                    <?php if($b['status'] == 'dipinjam'){?>
                        <a href="konfirmasi_kembali.php?id=<?= $b['id_transaksi']?>">Kembalikan </a>
                    <?php } else {?>
                    <?php } {?>
                </td>
            </tr> 
    <?php}?>

</table>

<br>
<a href="../dashboard.php">⬅ Kembali ke Dashboard</a>

