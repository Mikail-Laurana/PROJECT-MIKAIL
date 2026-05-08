<?php
// File: admin/components/header-admin.php
?>

<header class="admin-header">
    <div class="header-left">
        <button class="sidebar-toggle" onclick="toggleSidebar()">☰</button>
        <h1>Panel Administrasi</h1>
    </div>
    
    <div class="header-right">
        <div class="user-info">
            <span>Selamat datang, <?php echo htmlspecialchars($_SESSION['admin_name']); ?></span>
            <div class="user-menu">
                <button class="user-menu-toggle" onclick="toggleUserMenu()">
                    👤 <?php echo htmlspecialchars($_SESSION['admin_username']); ?> ▼
                </button>
                <div class="user-menu-dropdown" id="userMenuDropdown">
                    <a href="profile.php">👤 Profil</a>
                    <a href="logout.php" onclick="return confirm('Yakin ingin logout?')">🚪 Logout</a>
                </div>
            </div>
        </div>
    </div>
</header>

<script>
function toggleSidebar() {
    document.querySelector('.admin-sidebar').classList.toggle('collapsed');
}

function toggleUserMenu() {
    document.getElementById('userMenuDropdown').classList.toggle('show');
}

// Close user menu when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.user-menu-toggle')) {
        var dropdown = document.getElementById("userMenuDropdown");
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}
</script>