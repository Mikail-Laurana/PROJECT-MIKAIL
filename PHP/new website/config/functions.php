<?php
// File: config/functions.php
// Fungsi-fungsi untuk mengambil data dari database

require_once 'database.php';

// Fungsi untuk mengambil pengaturan sekolah
function getSchoolSettings() {
    try {
        $conn = getConnection();
        $query = "SELECT setting_key, setting_value FROM settings";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        $settings = [];
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        
        return $settings;
    } catch(PDOException $e) {
        return [];
    }
}

// Fungsi untuk mengambil berita terbaru
function getLatestNews($limit = 5) {
    try {
        $conn = getConnection();
        $query = "SELECT * FROM news WHERE status = 'published' 
                  ORDER BY created_at DESC LIMIT :limit";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

// Fungsi untuk mengambil semua berita
function getAllNews() {
    try {
        $conn = getConnection();
        $query = "SELECT * FROM news WHERE status = 'published' ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

// Fungsi untuk mengambil detail berita
function getNewsById($id) {
    try {
        $conn = getConnection();
        $query = "SELECT * FROM news WHERE id = :id AND status = 'published'";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return false;
    }
}

// Fungsi untuk mengambil data guru
function getAllTeachers() {
    try {
        $conn = getConnection();
        $query = "SELECT * FROM guru WHERE status = 'aktif' ORDER BY nama_lengkap ASC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

// Fungsi untuk mengambil data siswa
function getAllStudents() {
    try {
        $conn = getConnection();
        $query = "SELECT * FROM siswa WHERE status = 'aktif' ORDER BY kelas, nama_lengkap ASC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

// Fungsi untuk mengambil galeri
function getGalleryByCategory($category = null) {
    try {
        $conn = getConnection();
        
        if($category) {
            $query = "SELECT * FROM gallery WHERE category = :category 
                      ORDER BY created_at DESC";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':category', $category);
        } else {
            $query = "SELECT * FROM gallery ORDER BY created_at DESC";
            $stmt = $conn->prepare($query);
        }
        
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

// Fungsi untuk format tanggal Indonesia
function formatTanggal($date) {
    $bulan = [
        1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    $timestamp = strtotime($date);
    $hari = date('d', $timestamp);
    $bulan_num = date('n', $timestamp);
    $tahun = date('Y', $timestamp);
    
    return $hari . ' ' . $bulan[$bulan_num] . ' ' . $tahun;
}

// Fungsi untuk autentikasi admin
function authenticateAdmin($username, $password) {
    try {
        $conn = getConnection();
        $query = "SELECT id, username, password, nama_lengkap, role FROM admin WHERE username = :username";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($user && password_verify($password, $user['password'])) {
            return $user;
        }
        
        return false;
    } catch(PDOException $e) {
        return false;
    }
}
?>