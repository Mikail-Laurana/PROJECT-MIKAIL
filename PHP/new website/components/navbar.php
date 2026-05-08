<?php
// File: components/navbar.php
// Komponen navigasi

// Menentukan halaman aktif
$current_page = basename($_SERVER['PHP_SELF']);

// Menu navigasi
$menu_items = [
    'index.php' => 'Beranda',
    'about.php' => 'Tentang',
    'news.php' => 'Berita',
    'teachers.php' => 'Guru',
    'students.php' => 'Siswa',
    'gallery.php' => 'Galeri',
    'contact.php' => 'Kontak'
];
?>

<nav class="navbar">
    <ul>
        <?php foreach($menu_items as $file => $label): ?>
        <li>
            <a href="<?php echo $file; ?>" 
               class="<?php echo ($current_page == $file) ? 'active' : ''; ?>">
                <?php echo $label; ?>
            </a>
        </li>
        <?php endforeach; ?>
        <li>
            <a href="admin/login.php">Admin</a>
        </li>
    </ul>
</nav>