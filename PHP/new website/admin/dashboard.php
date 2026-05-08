<?php
// File: admin/dashboard.php
session_start();
require_once '../config/functions.php';
require_once '../config/security.php';

// Cek login
requireLogin();

// Ambil statistik
try {
    $conn = getConnection();
    
    $stats = [];
    $stats['total_news'] = $conn->query("SELECT COUNT(*) as count FROM news")->fetch()['count'];
    $stats['total_teachers'] = $conn->query("SELECT COUNT(*) as count FROM guru WHERE status='aktif'")->fetch()['count'];
    $stats['total_students'] = $conn->query("SELECT COUNT(*) as count FROM siswa WHERE status='aktif'")->fetch()['count'];
    $stats['total_messages'] = $conn->query("SELECT COUNT(*) as count FROM contact")->fetch()['count'];
    
} catch(PDOException $e) {
    $stats = [
        'total_news' => 0,
        'total_teachers' => 0,
        'total_students' => 0,
        'total_messages' => 0
    ];
}

// Berita terbaru
$recent_news = getLatestNews(5);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - SMA Negeri 1 Contoh</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="css/admin.css">
</head>
<body class="admin-body">
    <?php include 'components/sidebar.php'; ?>
    
    <div class="admin-content">
        <?php include 'components/header-admin.php'; ?>
        
        <main class="admin-main">
            <div class="admin-container">
                <h1>Dashboard</h1>
                
                <!-- Statistik Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📰</div>
                        <div class="stat-info">
                            <h3><?php echo $stats['total_news']; ?></h3>
                            <p>Total Berita</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">👨‍🏫</div>
                        <div class="stat-info">
                            <h3><?php echo $stats['total_teachers']; ?></h3>
                            <p>Total Guru</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">👨‍🎓</div>
                        <div class="stat-info">
                            <h3><?php echo $stats['total_students']; ?></h3>
                            <p>Total Siswa</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">✉️</div>
                        <div class="stat-info">
                            <h3><?php echo $stats['total_messages']; ?></h3>
                            <p>Pesan Masuk</p>
                        </div>
                    </div>
                </div>
                
                <!-- Berita Terbaru -->
                <div class="dashboard-section">
                    <h2>Berita Terbaru</h2>
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Judul</th>
                                    <th>Author</th>
                                    <th>Tanggal</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if(!empty($recent_news)): ?>
                                    <?php foreach($recent_news as $news): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($news['title']); ?></td>
                                        <td><?php echo htmlspecialchars($news['author']); ?></td>
                                        <td><?php echo formatTanggal($news['created_at']); ?></td>
                                        <td>
                                            <span class="status-badge status-<?php echo $news['status']; ?>">
                                                <?php echo ucfirst($news['status']); ?>
                                            </span>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="4" class="text-center">Belum ada berita</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="section-actions">
                        <a href="news.php" class="btn-primary">Kelola Berita</a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>