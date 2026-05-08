<?php session_start();?>
<form action="auth/proses_login.php" method="POST">
    <h2>LOGIN PERPUSTAKAAN</h2>
    Username <input type="text" name="username" required><br>
    Password <input type="password" name="password" required><br>
    <button type="submit">LOGIN</button>
    <a href="auth/register.php">Belum Punya Akun?</a>
</form>





