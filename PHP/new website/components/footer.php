<?php
// File: components/footer.php
// Komponen footer

$school_info = [
    'name' => 'SMA Negeri 1 Contoh',
    'address' => 'Jl. Pendidikan No. 123, Jakarta',
    'phone' => '(021) 1234-5678',
    'email' => 'info@sman1contoh.sch.id',
    'established' => 1985
];
?>

<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3><?php echo $school_info['name']; ?></h3>
                <p><?php echo $school_info['address']; ?></p>
                <p>Telp: <?php echo $school_info['phone']; ?></p>
                <p>Email: <?php echo $school_info['email']; ?></p>
            </div>
            
            <div class="footer-section">
                <h4>Menu Cepat</h4>
                <ul>
                    <li><a href="index.php">Beranda</a></li>
                    <li><a href="about.php">Tentang Kami</a></li>
                    <li><a href="news.php">Berita</a></li>
                    <li><a href="contact.php">Kontak</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>© <?php echo date('Y'); ?> <?php echo $school_info['name']; ?>. 
               Berdiri sejak <?php echo $school_info['established']; ?></p>
        </div>
    </div>
</footer>

</body>
</html>