<?php
// config/mail.php - Email Configuration & Functions

require_once __DIR__ . '/app.php';

/**
 * Simple mail sender using PHP mail() function
 * Untuk production, disarankan menggunakan PHPMailer atau Swift Mailer
 */
class SimpleMail {
    
    public static function send($to, $subject, $message, $from = null) {
        if (!$from) {
            $from = MAIL_FROM_ADDRESS;
        }
        
        $headers = [
            'From: ' . MAIL_FROM_NAME . ' <' . $from . '>',
            'Reply-To: ' . $from,
            'X-Mailer: PHP/' . phpversion(),
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8'
        ];
        
        $result = mail($to, $subject, $message, implode("\r\n", $headers));
        
        if (!$result && APP_DEBUG) {
            error_log("Failed to send email to: $to");
        }
        
        return $result;
    }
    
    /**
     * Send contact form notification
     */
    public static function sendContactNotification($data) {
        $subject = 'Pesan Baru dari Website ' . APP_NAME;
        
        $message = '
        <html>
        <head>
            <title>Pesan Kontak Baru</title>
        </head>
        <body>
            <h2>Pesan Kontak Baru</h2>
            <table border="1" cellpadding="10" cellspacing="0">
                <tr>
                    <td><strong>Nama</strong></td>
                    <td>' . htmlspecialchars($data['nama']) . '</td>
                </tr>
                <tr>
                    <td><strong>Email</strong></td>
                    <td>' . htmlspecialchars($data['email']) . '</td>
                </tr>
                <tr>
                    <td><strong>Tanggal</strong></td>
                    <td>' . date('d/m/Y H:i:s') . '</td>
                </tr>
                <tr>
                    <td><strong>Pesan</strong></td>
                    <td>' . nl2br(htmlspecialchars($data['pesan'])) . '</td>
                </tr>
            </table>
        </body>
        </html>';
        
        // Send to admin email (bisa dikonfigurasi di .env)
        $admin_email = EnvLoader::get('ADMIN_EMAIL', 'admin@localhost');
        
        return self::send($admin_email, $subject, $message);
    }
    
    /**
     * Send auto-reply to contact form sender
     */
    public static function sendContactAutoReply($data) {
        $subject = 'Terima kasih atas pesan Anda - ' . APP_NAME;
        
        $message = '
        <html>
        <head>
            <title>Terima Kasih</title>
        </head>
        <body>
            <h2>Terima Kasih, ' . htmlspecialchars($data['nama']) . '!</h2>
            <p>Kami telah menerima pesan Anda dan akan segera merespons.</p>
            
            <h3>Ringkasan Pesan Anda:</h3>
            <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #3498db;">
                ' . nl2br(htmlspecialchars($data['pesan'])) . '
            </blockquote>
            
            <p>Jika Anda memiliki pertanyaan mendesak, silakan hubungi kami langsung di:</p>
            <ul>
                <li>Telepon: (021) 1234-5678</li>
                <li>Email: info@sekolah.com</li>
            </ul>
            
            <hr>
            <p><small>Email ini dikirim otomatis, mohon jangan membalas.</small></p>
        </body>
        </html>';
        
        return self::send($data['email'], $subject, $message);
    }
}

/**
 * Advanced mail sender using SMTP (untuk production)
 * Uncomment dan sesuaikan jika ingin menggunakan SMTP
 */
/*
class SMTPMail {
    private $host;
    private $port;
    private $username;
    private $password;
    private $encryption;
    
    public function __construct() {
        $this->host = MAIL_HOST;
        $this->port = MAIL_PORT;
        $this->username = MAIL_USERNAME;
        $this->password = MAIL_PASSWORD;
        $this->encryption = MAIL_ENCRYPTION;
    }
    
    public function send($to, $subject, $message, $from = null) {
        // Implementasi SMTP sender
        // Bisa menggunakan PHPMailer, Swift Mailer, atau library lain
        
        return true;
    }
}
*/
?>