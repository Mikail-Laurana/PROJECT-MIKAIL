<?php
    session_start();
    include "../config/koneksi.php";

    $user = $_POST['username'];
    $password = MD5($_POST['password']);

    $data = mysqli_query($conn,"SELECT * FROM users WHERE username = '$user' AND password = '$password'");
    $cek = mysqli_fetch_assoc($data);

    if($cek){
        $_SESSION['id']=$cek['id'];
        $_SESSION['nama']=$cek['nama'];
        $_SESSION['role']=$cek['role'];

        if($cek['role'] == 'admin'){
            header("Location: ../admin/dashboard.php");
        }else{
            header("Location: ../user/dashboard.php");
        }
    }else{
        echo"Login Gagal";
    }
?>