<?php
// File: gallery.php
require_once 'config/functions.php';

$page_title = "Galeri";
$gallery = getGalleryByCategory();

include 'components/header.php';
?>

<main class="main-content">
    <section class="gallery-section">
        <div class="container">
            <h1>Galeri Sekolah</h1>
            
            <?php if(!empty($gallery)): ?>
            <div class="gallery-grid">
                <?php foreach($gallery as $item): ?>
                <div class="gallery-item">
                    <img src="uploads/gallery/<?php echo htmlspecialchars($item['image']); ?>" 
                         alt="<?php echo htmlspecialchars($item['title']); ?>"
                         onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                    <div class="gallery-info">
                        <h3><?php echo htmlspecialchars($item['title']); ?></h3>
                        <p><?php echo formatTanggal($item['created_at']); ?></p>
                        <?php if($item['category']): ?>
                        <span class="category"><?php echo htmlspecialchars($item['category']); ?></span>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php else: ?>
            <div class="empty-state">
                <p>Galeri foto belum tersedia.</p>
            </div>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php include 'components/footer.php'; ?>