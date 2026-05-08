<?php
// File: index.php
require_once 'config/functions.php';

// Ambil data dari database
$school_settings = getSchoolSettings();
$latest_news = getLatestNews(3);

// Set variabel untuk komponen
$page_title = "Beranda";
$site_title = $school_settings['school_name'] ?? "SMA Negeri 1 Contoh";

// Include header
include 'components/header.php';
?>

<main class="main-content">
    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h2>Selamat Datang di <?php echo $site_title; ?></h2>
            <p>Membentuk generasi cerdas dan berkarakter sejak <?php echo $school_settings['established_year'] ?? '1985'; ?></p>
            <a href="about.php" class="btn-primary">Pelajari Lebih Lanjut</a>
        </div>
    </section>

    <!-- Berita Terbaru -->
    <section class="news-section">
        <div class="container">
            <h2>Berita Terbaru</h2>
            <div class="news-grid">
                <?php if(!empty($latest_news)): ?>
                    <?php foreach($latest_news as $news): ?>
                    <div class="news-card">
                        <h3><?php echo htmlspecialchars($news['title']); ?></h3>
                        <p class="date"><?php echo formatTanggal($news['created_at']); ?></p>
                        <p><?php echo substr(strip_tags($news['content']), 0, 150) . '...'; ?></p>
                        <a href="news-detail.php?id=<?php echo $news['id']; ?>" class="read-more">
                            Baca Selengkapnya
                        </a>
                    </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="news-card">
                        <h3>Belum ada berita terbaru</h3>
                        <p>Silakan kembali lagi nanti untuk melihat berita terbaru dari sekolah.</p>
                    </div>
                <?php endif; ?>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <a href="news.php" class="btn-primary">Lihat Semua Berita</a>
            </div>
        </div>
    </section>
</main>

<?php include 'components/footer.php'; ?>