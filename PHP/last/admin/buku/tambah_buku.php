<form method="post">
    Judul <input  name="judul" required><br>
    Pengarang <input  name="pengarang" required><br>
    Penerbit <input name="penerbit" required><br>
    Tahun <input  name="tahun" required><br>
    Stok <input  name="stok" required><br>
    <button name="simpan">Tambah</button>
</form>

<?php
session_start();
include "../../config/koneksi.php";

if(isset($_POST['simpan'])){
    mysqli_query($conn,"INSERT INTO buku (judul,pengarang,penerbit,tahun,stok) VALUES('$_POST[judul]','$_POST[pengarang]','$_POST[penerbit]','$_POST[tahun]','$_POST[stok]')");
    header("Location:data_buku.php");
}
?>