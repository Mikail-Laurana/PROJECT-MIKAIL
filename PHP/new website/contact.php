<?php
// File: contact.php
session_start();
require_once 'config/functions.php';
require_once 'config/security.php';
require_once 'config/mail.php';

$page_title = "Kontak";
$site_title = APP_NAME;
$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'])) {
        $message = "CSRF token tidak valid!";
    } elseif (!checkRateLimit("contact_form", 3, 300)) {
        $message = "Terlalu banyak percobaan. Coba lagi nanti.";
    } else {
        $nama  = cleanInput($_POST['nama']);
        $email = cleanInput($_POST['email']);
        $pesan = cleanInput($_POST['pesan']);

        if (!$nama || !$email || !$pesan) {
            $message = "Semua field wajib diisi.";
        } elseif (!validateEmail($email)) {
            $message = "Format email tidak valid.";
        } else {
            try {
                $conn = getConnection();
                $query = "INSERT INTO contact (nama, email, pesan, created_at) 
                          VALUES (:nama, :email, :pesan, NOW())";
                $stmt = $conn->prepare($query);
                $stmt->bindParam(':nama', $nama);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':pesan', $pesan);
                $stmt->execute();

                logActivity("contact_form", "Pesan dari $nama ($email)");
                
                // Send email notification if configured
                if (MAIL_HOST && MAIL_FROM_ADDRESS) {
                    try {
                        SimpleMail::sendContactNotification([
                            'nama' => $nama,
                            'email' => $email,
                            'pesan' => $pesan
                        ]);
                        
                        // Send auto-reply
                        SimpleMail::sendContactAutoReply([
                            'nama' => $nama,
                            'email' => $email,
                            'pesan' => $pesan
                        ]);
                    } catch (Exception $e) {
                        if (APP_DEBUG) {
                            error_log("Mail sending failed: " . $e->getMessage());
                        }
                    }
                }
                
                $message = "Pesan berhasil dikirim!";
                
                // Reset form
                $_POST = [];
            } catch (PDOException $e) {
                $message = "Terjadi kesalahan: " . $e->getMessage();
            }
        }
    }
}

include 'components/header.php';
?>

<main class="main-content">
    <section class="contact-section">
        <div class="container">
            <h1>Hubungi Kami</h1>

            <?php if ($message): ?>
                <div class="alert <?php echo strpos($message, 'berhasil') !== false ? 'success' : 'error'; ?>">
                    <?php echo htmlspecialchars($message); ?>
                </div>
            <?php endif; ?>

            <div class="contact-content">
                <div class="contact-info">
                    <h2>Informasi Kontak</h2>
                    <div class="info-item">
                        <strong>📍 Alamat:</strong>
                        <p>Jl. Pendidikan No. 123, Jakarta</p>
                    </div>
                    <div class="info-item">
                        <strong>📞 Telepon:</strong>
                        <p>(021) 1234-5678</p>
                    </div>
                    <div class="info-item">
                        <strong>📧 Email:</strong>
                        <p>info@sman1contoh.sch.id</p>
                    </div>
                    <div class="info-item">
                        <strong>🕒 Jam Operasional:</strong>
                        <p>Senin - Jumat: 07:00 - 15:00</p>
                        <p>Sabtu: 07:00 - 12:00</p>
                    </div>
                </div>

                <div class="contact-form">
                    <h2>Kirim Pesan</h2>
                    <form method="post" action="contact.php">
                        <input type="hidden" name="csrf_token" value="<?php echo generateCSRFToken(); ?>">

                        <div class="form-group">
                            <label for="nama">Nama Lengkap</label>
                            <input type="text" id="nama" name="nama" required 
                                   value="<?php echo isset($_POST['nama']) ? htmlspecialchars($_POST['nama']) : ''; ?>">
                        </div>

                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required 
                                   value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                        </div>

                        <div class="form-group">
                            <label for="pesan">Pesan</label>
                            <textarea id="pesan" name="pesan" rows="5" required><?php echo isset($_POST['pesan']) ? htmlspecialchars($_POST['pesan']) : ''; ?></textarea>
                        </div>

                        <button type="submit" class="btn-primary">Kirim Pesan</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include 'components/footer.php'; ?>