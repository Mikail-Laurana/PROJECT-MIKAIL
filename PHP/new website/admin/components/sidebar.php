<?php
// File: admin/components/sidebar.php
$current_page = basename($_SERVER['PHP_SELF']);
?>

<aside class="admin-sidebar">
    <div class="sidebar-header">
        <h2>Admin Panel</h2>
        <p>SMA Negeri 1 Contoh</p>
    </div>
    
    <nav class="sidebar-nav">
        <ul>
            <li>
                <a href="dashboard.php" class="<?php echo $current_page == 'dashboard.php' ? 'active' : ''; ?>">
                    📊 Dashboard
                </a>
            </li>
            <li>
                <a href="news.php" class="<?php echo $current_page == 'news.php' ? 'active' : ''; ?>">
                    📰 Berita
                </a>
            </li>
            <li>
                <a href="teachers.php" class="<?php echo $current_page == 'teachers.php' ? 'active' : ''; ?>">
                    👨‍🏫 Data Guru
                </a>
            </li>
            <li>
                <a href="students.php" class="<?php echo $current_page == 'students.php' ? 'active' : ''; ?>">
                    👨‍🎓 Data Siswa
                </a>
            </li>
            <li>
                <a href="messages.php" class="<?php echo $current_page == 'messages.php' ? 'active' : ''; ?>">
                    ✉️ Pesan Kontak
                </a>
            </li>
            <li>
                <a href="settings.php" class="<?php echo $current_page == 'settings.php' ? 'active' : ''; ?>">
                    ⚙️ Pengaturan
                </a>
            </li>
        </ul>
    </nav>
    
    <div class="sidebar-footer">
        <a href="../index.php" target="_blank" class="btn-outline">🌐 Lihat Website</a>
    </div>
</aside>