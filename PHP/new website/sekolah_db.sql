-- Database: sekolah_db
-- Buat database terlebih dahulu

CREATE DATABASE IF NOT EXISTS sekolah_db;
USE sekolah_db;

-- Tabel admin untuk login
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('admin', 'operator') DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel settings untuk konfigurasi sekolah
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel news untuk berita
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    status ENUM('draft', 'published') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel guru
CREATE TABLE guru (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    no_telepon VARCHAR(20),
    alamat TEXT,
    mata_pelajaran VARCHAR(100),
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    tanggal_lahir DATE,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel siswa
CREATE TABLE siswa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nis VARCHAR(15) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    jurusan VARCHAR(50),
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    tanggal_lahir DATE,
    alamat TEXT,
    no_telepon VARCHAR(20),
    email VARCHAR(100),
    nama_wali VARCHAR(100),
    no_telepon_wali VARCHAR(20),
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel gallery
CREATE TABLE gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel contact untuk pesan kontak
CREATE TABLE contact (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    pesan TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data default
INSERT INTO admin (username, password, nama_lengkap, email, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin@sekolah.com', 'admin');

INSERT INTO settings (setting_key, setting_value) VALUES 
('school_name', 'SMA Negeri 1 Contoh'),
('established_year', '1985'),
('school_address', 'Jl. Pendidikan No. 123, Jakarta'),
('school_phone', '(021) 1234-5678'),
('school_email', 'info@sman1contoh.sch.id');

INSERT INTO news (title, content, author) VALUES 
('Selamat Datang di Website Baru', 'Website resmi SMA Negeri 1 Contoh telah diluncurkan dengan tampilan dan fitur yang lebih baik.', 'Admin'),
('Penerimaan Siswa Baru 2024', 'Pendaftaran siswa baru untuk tahun ajaran 2024/2025 telah dibuka. Informasi lengkap dapat dilihat di pengumuman sekolah.', 'Admin'),
('Prestasi Siswa di Olimpiade Sains', 'Tim Olimpiade Sains sekolah berhasil meraih juara 2 tingkat provinsi dalam bidang Matematika dan Fisika.', 'Admin');