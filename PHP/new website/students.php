<?php
// File: students.php
require_once 'config/functions.php';

$page_title = "Data Siswa";
$students = getAllStudents();

// Kelompokkan siswa berdasarkan kelas
$students_by_class = [];
foreach($students as $student) {
    $students_by_class[$student['kelas']][] = $student;
}
ksort($students_by_class);

include 'components/header.php';
?>

<main class="main-content">
    <section class="students-section">
        <div class="container">
            <h1>Data Siswa</h1>
            
            <?php if(!empty($students_by_class)): ?>
            <?php foreach($students_by_class as $class => $class_students): ?>
            <div class="class-section">
                <h2>Kelas <?php echo htmlspecialchars($class); ?></h2>
                <div class="students-grid">
                    <?php foreach($class_students as $student): ?>
                    <div class="student-card">
                        <h3><?php echo htmlspecialchars($student['nama_lengkap']); ?></h3>
                        <p class="nis">NIS: <?php echo htmlspecialchars($student['nis']); ?></p>
                        <p class="class">Kelas: <?php echo htmlspecialchars($student['kelas']); ?></p>
                        <?php if($student['jurusan']): ?>
                        <p class="major">Jurusan: <?php echo htmlspecialchars($student['jurusan']); ?></p>
                        <?php endif; ?>
                        <p class="gender">
                            <?php echo $student['jenis_kelamin'] == 'L' ? '👦 Laki-laki' : '👧 Perempuan'; ?>
                        </p>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endforeach; ?>
            <?php else: ?>
            <div class="empty-state">
                <p>Data siswa belum tersedia.</p>
            </div>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php include 'components/footer.php'; ?>