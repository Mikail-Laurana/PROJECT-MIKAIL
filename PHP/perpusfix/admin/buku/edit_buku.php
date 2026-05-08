<?php
include '../../config/koneksi.php';
$id_buku = $_GET['id'];
$query = mysqli_query($conn,"SELECT * FROM buku WHERE id_buku='$id_buku'");
$data = mysqli_fetch_array($query);
?>

<Form method="POST">
    <h3>Edit Data Buku</h3>
    <input type="hidden" name="id_buku"value="<?php echo $data['id_buku']; ?>"><br>

    Judul Buku<input type="text" name="judul"value="<?php echo $data['judul']; ?>"><br>
    Pengarang<input type="text" name="pengarang"value="<?php echo $data['pengarang']; ?>"><br>
    Penerbit<input type="text" name="penerbit"value="<?php echo $data['penerbit']; ?>"><br>
    Stok<input type="text" name="stok"value="<?php echo $data['stok']; ?>"><br>

    <button type="submit" name="update">Update Buku</button>
</Form>

<?php
    if(isset($_POST['update'])){
        $id     = $_POST['id_buku'];
        $judul     = $_POST['judul'];
        $pengarang     = $_POST['pengarang'];
        $penerbit     = $_POST['penerbit'];
        $stok     = $_POST['stok'];
        
        $query = mysqli_query($conn,"UPDATE buku SET judul='$judul',pengarang='$pengarang',penerbit='$penerbit',stok='$stok' WHERE id_buku='$id'");

        if($query){
            header("Location:data_buku.php");
        }else{
            echo "Gagal Mengupdate Data";
        }
    }
?>