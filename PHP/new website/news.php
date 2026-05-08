<?php
// File: news.php
require_once 'config/functions.php';

$page_title = "Berita";
$all_news = getAllNews();

include 'components/header.php';
?>

<main class="main-content">
    <section class="news-section">
        <div class="container">
            <h1>Semua Berita</h1>
            
            <div class="news-grid">
                <?php if(!empty($all_news)): ?>
                    <?php foreach($all_news as $news): ?>
                    <div class="news-card">
                        <h3><?php echo htmlspecialchars($news['title']); ?></h3>
                        <p class="date"><?php echo formatTanggal($news['created_at']); ?></p>
                        <p class="author">Oleh: <?php echo htmlspecialchars($news['author']); ?></p>
                        <p><?php echo substr(strip_tags($news['content']), 0, 200) . '...'; ?></p>
                        <a href="news-detail.php?id=<?php echo $news['id']; ?>" class="read-more">
                            Baca Selengkapnya
                        </a>
                    </div>
                    <?php endforeach; ?>
                <?php else: ?>
                    <div class="news-card">
                        <h3>Belum ada berita</h3>
                        <p>Belum ada berita yang tersedia saat ini. Silakan kembali lagi nanti.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
</main>

<?php include 'components/footer.php'; ?>