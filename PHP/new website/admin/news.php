<?php
// File: admin/news.php
session_start();
require_once '../config/functions.php';
require_once '../config/security.php';

// Cek login
requireLogin();

$message = "";
$action = $_GET['action'] ?? 'list';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = cleanInput($_POST['title']);
    $content = cleanInput($_POST['content']);
    $author = cleanInput($_POST['author']);
    $status = cleanInput($_POST['status']);
    
    try {
        $conn = getConnection();
        
        if ($action === 'add') {
            $query = "INSERT INTO news (title, content, author, status, created_at) VALUES (:title, :content, :author, :status, NOW())";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':author', $author);
            $stmt->bindParam(':status', $status);
            $stmt->execute();
            
            logActivity("add_news", "Added news: $title");
            $message = "Berita berhasil ditambahkan!";
            
        } elseif ($action === 'edit' && isset($_POST['id'])) {
            $id = (int)$_POST['id'];
            $query = "UPDATE news SET title = :title, content = :content, author = :author, status = :status WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':author', $author);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            logActivity("edit_news", "Edited news ID: $id");
            $message = "Berita berhasil diperbarui!";
        }
        
        // Redirect to avoid resubmission
        header("Location: news.php?message=" . urlencode($message));
        exit();
        
    } catch (PDOException $e) {
        $message = "Error: " . $e->getMessage();
    }
}

// Handle delete
if ($action === 'delete' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    try {
        $conn = getConnection();
        $stmt = $conn->prepare("DELETE FROM news WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        logActivity("delete_news", "Deleted news ID: $id");
        $message = "Berita berhasil dihapus!";
    } catch (PDOException $e) {
        $message = "Error: " . $e->getMessage();
    }
}

// Get news for editing
$editNews = null;
if ($action === 'edit' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    try {
        $conn = getConnection();
        $stmt = $conn->prepare("SELECT * FROM news WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $editNews = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $message = "Error: " . $e->getMessage();
    }
}

// Get all news
$allNews = [];
try {
    $conn = getConnection();
    $stmt = $conn->prepare("SELECT * FROM news ORDER BY created_at DESC");
    $stmt->execute();
    $allNews = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $message = "Error: " . $e->getMessage();
}

// Get message from URL
if (isset($_GET['message'])) {
    $message = $_GET['message'];
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelola Berita - Admin</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="css/admin.css">
</head>
<body class="admin-body">
    <?php include 'components/sidebar.php'; ?>
    
    <div class="admin-content">
        <?php include 'components/header-admin.php'; ?>
        
        <main class="admin-main">
            <div class="admin-container">
                <div class="page-header">
                    <h1>Kelola Berita</h1>
                    <?php if ($action === 'list'): ?>
                    <a href="?action=add" class="btn-primary">+ Tambah Berita</a>
                    <?php else: ?>
                    <a href="news.php" class="btn-outline">← Kembali</a>
                    <?php endif; ?>
                </div>
                
                <?php if ($message): ?>
                <div class="alert <?php echo strpos($message, 'berhasil') !== false ? 'success' : 'error'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
                <?php endif; ?>
                
                <?php if ($action === 'add' || $action === 'edit'): ?>
                <!-- Form Add/Edit -->
                <div class="form-container">
                    <h2><?php echo $action === 'add' ? 'Tambah Berita Baru' : 'Edit Berita'; ?></h2>
                    
                    <form method="POST">
                        <?php if ($action === 'edit' && $editNews): ?>
                        <input type="hidden" name="id" value="<?php echo $editNews['id']; ?>">
                        <?php endif; ?>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="title">Judul Berita</label>
                                <input type="text" id="title" name="title" required 
                                       value="<?php echo $editNews ? htmlspecialchars($editNews['title']) : ''; ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="author">Penulis</label>
                                <input type="text" id="author" name="author" required 
                                       value="<?php echo $editNews ? htmlspecialchars($editNews['author']) : $_SESSION['admin_name']; ?>">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="status">Status</label>
                            <select id="status" name="status" required>
                                <option value="draft" <?php echo ($editNews && $editNews['status'] === 'draft') ? 'selected' : ''; ?>>Draft</option>
                                <option value="published" <?php echo (!$editNews || $editNews['status'] === 'published') ? 'selected' : ''; ?>>Published</option>
                            </select>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="content">Isi Berita</label>
                            <textarea id="content" name="content" rows="10" required><?php echo $editNews ? htmlspecialchars($editNews['content']) : ''; ?></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">
                                <?php echo $action === 'add' ? 'Tambah Berita' : 'Update Berita'; ?>
                            </button>
                            <a href="news.php" class="btn-outline">Batal</a>
                        </div>
                    </form>
                </div>
                
                <?php else: ?>
                <!-- List Berita -->
                <div class="table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Judul</th>
                                <th>Penulis</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($allNews)): ?>
                                <?php foreach ($allNews as $news): ?>
                                <tr>
                                    <td><?php echo $news['id']; ?></td>
                                    <td><?php echo htmlspecialchars($news['title']); ?></td>
                                    <td><?php echo htmlspecialchars($news['author']); ?></td>
                                    <td>
                                        <span class="status-badge status-<?php echo $news['status']; ?>">
                                            <?php echo ucfirst($news['status']); ?>
                                        </span>
                                    </td>
                                    <td><?php echo formatTanggal($news['created_at']); ?></td>
                                    <td class="action-buttons">
                                        <a href="?action=edit&id=<?php echo $news['id']; ?>" class="btn-success">Edit</a>
                                        <a href="?action=delete&id=<?php echo $news['id']; ?>" 
                                           class="btn-danger" 
                                           onclick="return confirm('Yakin ingin menghapus berita ini?')">Hapus</a>
                                        <a href="../news-detail.php?id=<?php echo $news['id']; ?>" 
                                           target="_blank" class="btn-outline">Lihat</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="6" class="text-center">Belum ada berita</td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</body>
</html>