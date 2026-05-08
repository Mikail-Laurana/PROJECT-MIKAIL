<?php
// File: admin/logout.php
session_start();
require_once '../config/security.php';

// Log aktivitas logout
if(isset($_SESSION['admin_username'])) {
    logActivity("admin_logout", "Logout untuk user: " . $_SESSION['admin_username']);
}

// Hapus semua session
session_destroy();

// Redirect ke halaman login
header('Location: login.php?message=logout');
exit();
?>