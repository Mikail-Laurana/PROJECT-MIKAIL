<?php
// File: teachers.php
require_once 'config/functions.php';

$page_title = "Data Guru";
$teachers = getAllTeachers();

include 'components/header.php';
?>

<main class="main-content">
    <section class="teachers-section">
        <div class="container">
            <h1>Data Guru</h1>
            
            <?php if(!empty($teachers)): ?>
            <div class="teachers-grid">
                <?php foreach($teachers as $teacher): ?>
                <div class="teacher-card">
                    <h3><?php echo htmlspecialchars($teacher['nama_lengkap']); ?></h3>
                    <p class="nip">NIP: <?php echo htmlspecialchars($teacher['nip']); ?></p>
                    <p class="subject">Mata Pelajaran: <?php echo htmlspecialchars($teacher['mata_pelajaran']); ?></p>
                    <div class="teacher-info">
                        <?php if($teacher['email']): ?>
                        <p>📧 <?php echo htmlspecialchars($teacher['email']); ?></p>
                        <?php endif; ?>
                        <?php if($teacher['no_telepon']): ?>
                        <p>📞 <?php echo htmlspecialchars($teacher['no_telepon']); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php else: ?>
            <div class="empty-state">
                <p>Data guru belum tersedia.</p>
            </div>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php include 'components/footer.php'; ?>