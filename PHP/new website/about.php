<?php
// File: about.php
require_once 'config/functions.php';

// Set judul halaman
$page_title = "Tentang Kami";
$school_settings = getSchoolSettings();
$site_title = $school_settings['school_name'] ?? "SMA Negeri 1 Contoh";

// Include header
include 'components/header.php';
?>

<main class="main-content">
    <section class="about-section">
        <div class="container">
            <h1>Tentang <?php echo $site_title; ?></h1>
            <p>Sekolah kami berdiri sejak tahun <?php echo $school_settings['established_year'] ?? '1985'; ?> dengan komitmen untuk memberikan pendidikan berkualitas tinggi kepada generasi muda Indonesia.</p>
            
            <div class="about-content">
                <h2>Visi</h2>
                <p>Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, cerdas, dan siap menghadapi tantangan masa depan.</p>
                
                <h2>Misi</h2>
                <ul>
                    <li>Menyelenggarakan pendidikan yang berkualitas dengan standar nasional</li>
                    <li>Mengembangkan potensi akademik dan non-akademik siswa</li>
                    <li>Membentuk karakter siswa yang berakhlak mulia</li>
                    <li>Menciptakan lingkungan belajar yang kondusif dan inovatif</li>
                </ul>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <h3>1200+</h3>
                    <p>Siswa Aktif</p>
                </div>
                <div class="stat-item">
                    <h3>80+</h3>
                    <p>Guru Berpengalaman</p>
                </div>
                <div class="stat-item">
                    <h3>95%</h3>
                    <p>Tingkat Kelulusan</p>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include 'components/footer.php'; ?>