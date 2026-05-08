<?php
// File: admin/teachers.php
session_start();
require_once '../config/functions.php';
require_once '../config/security.php';

// Cek login
requireLogin();

$message = "";
$action = $_GET['action'] ?? 'list';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nip = cleanInput($_POST['nip']);
    $nama_lengkap = cleanInput($_POST['nama_lengkap']);
    $email = cleanInput($_POST['email']);
    $no_telepon = cleanInput($_POST['no_telepon']);
    $alamat = cleanInput($_POST['alamat']);
    $mata_pelajaran = cleanInput($_POST['mata_pelajaran']);
    $jenis_kelamin = cleanInput($_POST['jenis_kelamin']);
    $tanggal_lahir = cleanInput($_POST['tanggal_lahir']);
    
    // Validation
    $errors = validateRequired(['nip', 'nama_lengkap', 'mata_pelajaran', 'jenis_kelamin'], $_POST);
    
    if ($email && !validateEmail($email)) {
        $errors[] = "Format email tidak valid";
    }
    
    if (!empty($errors)) {
        $message = implode(", ", $errors);
    } else {
        try {
            $conn = getConnection();
            
            if ($action === 'add') {
                // Check if NIP already exists
                $stmt = $conn->prepare("SELECT COUNT(*) FROM guru WHERE nip = :nip");
                $stmt->bindParam(':nip', $nip);
                $stmt->execute();
                
                if ($stmt->fetchColumn() > 0) {
                    $message = "NIP sudah terdaftar!";
                } else {
                    $query = "INSERT INTO guru (nip, nama_lengkap, email, no_telepon, alamat, mata_pelajaran, jenis_kelamin, tanggal_lahir, status) 
                              VALUES (:nip, :nama_lengkap, :email, :no_telepon, :alamat, :mata_pelajaran, :jenis_kelamin, :tanggal_lahir, 'aktif')";
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':nip', $nip);
                    $stmt->bindParam(':nama_lengkap', $nama_lengkap);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':no_telepon', $no_telepon);
                    $stmt->bindParam(':alamat', $alamat);
                    $stmt->bindParam(':mata_pelajaran', $mata_pelajaran);
                    $stmt->bindParam(':jenis_kelamin', $jenis_kelamin);
                    $stmt->bindParam(':tanggal_lahir', $tanggal_lahir);
                    $stmt->execute();
                    
                    logActivity("add_teacher", "Added teacher: $nama_lengkap (NIP: $nip)");
                    $message = "Data guru berhasil ditambahkan!";
                }
                
            } elseif ($action === 'edit' && isset($_POST['id'])) {
                $id = (int)$_POST['id'];
                
                // Check if NIP already exists (exclude current record)
                $stmt = $conn->prepare("SELECT COUNT(*) FROM guru WHERE nip = :nip AND id != :id");
                $stmt->bindParam(':nip', $nip);
                $stmt->bindParam(':id', $id);
                $stmt->execute();
                
                if ($stmt->fetchColumn() > 0) {
                    $message = "NIP sudah digunakan guru lain!";
                } else {
                    $query = "UPDATE guru SET nip = :nip, nama_lengkap = :nama_lengkap, email = :email, 
                              no_telepon = :no_telepon, alamat = :alamat, mata_pelajaran = :mata_pelajaran, 
                              jenis_kelamin = :jenis_kelamin, tanggal_lahir = :tanggal_lahir WHERE id = :id";
                    $stmt = $conn->prepare($query);
                    $stmt->bindParam(':nip', $nip);
                    $stmt->bindParam(':nama_lengkap', $nama_lengkap);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':no_telepon', $no_telepon);
                    $stmt->bindParam(':alamat', $alamat);
                    $stmt->bindParam(':mata_pelajaran', $mata_pelajaran);
                    $stmt->bindParam(':jenis_kelamin', $jenis_kelamin);
                    $stmt->bindParam(':tanggal_lahir', $tanggal_lahir);
                    $stmt->bindParam(':id', $id);
                    $stmt->execute();
                    
                    logActivity("edit_teacher", "Edited teacher ID: $id");
                    $message = "Data guru berhasil diperbarui!";
                }
            }
            
            if (strpos($message, 'berhasil') !== false) {
                header("Location: teachers.php?message=" . urlencode($message));
                exit();
            }
            
        } catch (PDOException $e) {
            $message = "Error: " . $e->getMessage();
        }
    }
}

// Handle delete
if ($action === 'delete' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    try {
        $conn = getConnection();
        $stmt = $conn->prepare("UPDATE guru SET status = 'nonaktif' WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        logActivity("delete_teacher", "Deactivated teacher ID: $id");
        $message = "Guru berhasil dinonaktifkan!";
    } catch (PDOException $e) {
        $message = "Error: " . $e->getMessage();
    }
}

// Get teacher for editing
$editTeacher = null;
if ($action === 'edit' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    try {
        $conn = getConnection();
        $stmt = $conn->prepare("SELECT * FROM guru WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $editTeacher = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $message = "Error: " . $e->getMessage();
    }
}

// Get all teachers
$allTeachers = [];
try {
    $conn = getConnection();
    $stmt = $conn->prepare("SELECT * FROM guru WHERE status = 'aktif' ORDER BY nama_lengkap ASC");
    $stmt->execute();
    $allTeachers = $stmt->fetchAll(PDO::FETCH_ASSOC);
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
    <title>Kelola Guru - Admin</title>
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
                    <h1>Kelola Data Guru</h1>
                    <?php if ($action === 'list'): ?>
                    <a href="?action=add" class="btn-primary">+ Tambah Guru</a>
                    <?php else: ?>
                    <a href="teachers.php" class="btn-outline">← Kembali</a>
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
                    <h2><?php echo $action === 'add' ? 'Tambah Guru Baru' : 'Edit Data Guru'; ?></h2>
                    
                    <form method="POST">
                        <?php if ($action === 'edit' && $editTeacher): ?>
                        <input type="hidden" name="id" value="<?php echo $editTeacher['id']; ?>">
                        <?php endif; ?>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="nip">NIP</label>
                                <input type="text" id="nip" name="nip" required 
                                       value="<?php echo $editTeacher ? htmlspecialchars($editTeacher['nip']) : ''; ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="nama_lengkap">Nama Lengkap</label>
                                <input type="text" id="nama_lengkap" name="nama_lengkap" required 
                                       value="<?php echo $editTeacher ? htmlspecialchars($editTeacher['nama_lengkap']) : ''; ?>">
                            </div>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" 
                                       value="<?php echo $editTeacher ? htmlspecialchars($editTeacher['email']) : ''; ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="no_telepon">No. Telepon</label>
                                <input type="text" id="no_telepon" name="no_telepon" 
                                       value="<?php echo $editTeacher ? htmlspecialchars($editTeacher['no_telepon']) : ''; ?>">
                            </div>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="mata_pelajaran">Mata Pelajaran</label>
                                <input type="text" id="mata_pelajaran" name="mata_pelajaran" required 
                                       value="<?php echo $editTeacher ? htmlspecialchars($editTeacher['mata_pelajaran']) : ''; ?>">
                            </div>
                            
                            <div class="form-group">
                                <label for="jenis_kelamin">Jenis Kelamin</label>
                                <select id="jenis_kelamin" name="jenis_kelamin" required>
                                    <option value="">Pilih...</option>
                                    <option value="L" <?php echo ($editTeacher && $editTeacher['jenis_kelamin'] === 'L') ? 'selected' : ''; ?>>Laki-laki</option>
                                    <option value="P" <?php echo ($editTeacher && $editTeacher['jenis_kelamin'] === 'P') ? 'selected' : ''; ?>>Perempuan</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="tanggal_lahir">Tanggal Lahir</label>
                            <input type="date" id="tanggal_lahir" name="tanggal_lahir" 
                                   value="<?php echo $editTeacher ? $editTeacher['tanggal_lahir'] : ''; ?>">
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="alamat">Alamat</label>
                            <textarea id="alamat" name="alamat" rows="3"><?php echo $editTeacher ? htmlspecialchars($editTeacher['alamat']) : ''; ?></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn-primary">
                                <?php echo $action === 'add' ? 'Tambah Guru' : 'Update Data'; ?>
                            </button>
                            <a href="teachers.php" class="btn-outline">Batal</a>
                        </div>
                    </form>
                </div>
                
                <?php else: ?>
                <!-- List Guru -->
                <div class="table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>NIP</th>
                                <th>Nama Lengkap</th>
                                <th>Mata Pelajaran</th>
                                <th>Email</th>
                                <th>No. Telepon</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (!empty($allTeachers)): ?>
                                <?php foreach ($allTeachers as $teacher): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($teacher['nip']); ?></td>
                                    <td><?php echo htmlspecialchars($teacher['nama_lengkap']); ?></td>
                                    <td><?php echo htmlspecialchars($teacher['mata_pelajaran']); ?></td>
                                    <td><?php echo htmlspecialchars($teacher['email']); ?></td>
                                    <td><?php echo htmlspecialchars($teacher['no_telepon']); ?></td>
                                    <td class="action-buttons">
                                        <a href="?action=edit&id=<?php echo $teacher['id']; ?>" class="btn-success">Edit</a>
                                        <a href="?action=delete&id=<?php echo $teacher['id']; ?>" 
                                           class="btn-danger" 
                                           onclick="return confirm('Yakin ingin menghapus data guru ini?')">Hapus</a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="6" class="text-center">Belum ada data guru</td>
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