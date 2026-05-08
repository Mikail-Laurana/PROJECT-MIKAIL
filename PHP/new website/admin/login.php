<?php
// File: admin/login.php
session_start();
require_once '../config/functions.php';
require_once '../config/security.php';

// Redirect jika sudah login
if(isset($_SESSION['admin_id'])) {
    header('Location: dashboard.php');
    exit();
}

$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!checkRateLimit("admin_login", 5, 300)) {
        $message = "Terlalu banyak percobaan login. Coba lagi nanti.";
    } else {
        $username = cleanInput($_POST['username']);
        $password = $_POST['password'];

        if(!$username || !$password) {
            $message = "Username dan password wajib diisi.";
        } else {
            $user = authenticateAdmin($username, $password);
            
            if($user) {
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_username'] = $user['username'];
                $_SESSION['admin_name'] = $user['nama_lengkap'];
                $_SESSION['admin_role'] = $user['role'];
                
                logActivity("admin_login", "Login berhasil untuk user: $username");
                header('Location: dashboard.php');
                exit();
            } else {
                $message = "Username atau password salah.";
                logActivity("admin_login_failed", "Login gagal untuk user: $username");
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - SMA Negeri 1 Contoh</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 100%;
            max-width: 400px;
        }
        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .login-header h1 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }
        .btn-login {
            width: 100%;
            padding: 12px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
        }
        .btn-login:hover {
            background: #2980b9;
        }
        .alert {
            padding: 10px;
            margin-bottom: 1rem;
            border-radius: 5px;
        }
        .alert.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .back-link {
            text-align: center;
            margin-top: 1rem;
        }
        .back-link a {
            color: #3498db;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>Login Admin</h1>
            <p>Masuk ke panel administrasi</p>
        </div>

        <?php if($message): ?>
        <div class="alert error">
            <?php echo htmlspecialchars($message); ?>
        </div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>

            <button type="submit" class="btn-login">Login</button>
        </form>

        <div class="back-link">
            <a href="../index.php">← Kembali ke Website</a>
        </div>
        
        <div style="margin-top: 1rem; padding: 10px; background: #e8f4f8; border-radius: 5px; font-size: 0.9rem;">
            <strong>Demo Login:</strong><br>
            Username: admin<br>
            Password: password
        </div>
    </div>
</body>
</html>