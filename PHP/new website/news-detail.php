<?php
// File: news-detail.php
require_once 'config/functions.php';

// Ambil ID berita dari URL
$news_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if($news_id <= 0) {
    header('Location: news.php');
    exit;
}

// Ambil detail berita
$news = getNewsById($news_id);
if(!$news) {
    header('Location: news.php');
    exit;
}

$page_title = $news['title'];
include 'components/header.php';
?>

<main class="main-content">
    <article class="news-detail">
        <div class="container">
            <div class="breadcrumb">
                <a href="index.php">Beranda</a> > 
                <a href="news.php">Berita</a> > 
                <span><?php echo htmlspecialchars($news['title']); ?></span>
            </div>
            
            <header class="article-header">
                <h1><?php echo htmlspecialchars($news['title']); ?></h1>
                <div class="article-meta">
                    <span class="author">👤 <?php echo htmlspecialchars($news['author']); ?></span>
                    <span class="date">📅 <?php echo formatTanggal($news['created_at']); ?></span>
                </div>
            </header>
            
            <div class="article-content">
                <?php echo nl2br(htmlspecialchars($news['content'])); ?>
            </div>
            
            <div class="article-actions">
                <button onclick="shareArticle()" class="btn-share">📤 Bagikan</button>
                <button onclick="printArticle()" class="btn-print">🖨️ Cetak</button>
                <a href="news.php" class="btn-back">← Kembali ke Berita</a>
            </div>
        </div>
    </article>
</main>

<script>
function shareArticle() {
    if (navigator.share) {
        navigator.share({
            title: '<?php echo addslashes($news['title']); ?>',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link berhasil disalin ke clipboard!');
    }
}

function printArticle() {
    window.print();
}
</script>

<?php include 'components/footer.php'; ?>