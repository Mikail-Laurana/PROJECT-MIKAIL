<?php
// File: components/header.php
// Komponen header yang bisa dipakai di semua halaman

// Data sekolah (nanti bisa dari database)
$site_title = $site_title ?? "SMA Negeri 1 Contoh";
$page_title = $page_title ?? "Beranda";
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $site_title . " - " . $page_title; ?></title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="logo">
                <h1><?php echo $site_title; ?></h1>
                <p>Membentuk Generasi Cerdas</p>
            </div>
            <?php include 'components/navbar.php'; ?>
        </div>
    </header>