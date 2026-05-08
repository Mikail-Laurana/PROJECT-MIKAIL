<?php
// config/app.php - Application Configuration

require_once __DIR__ . '/env.php';

// Application Settings
define('APP_NAME', EnvLoader::get('APP_NAME', 'SMA Negeri 1 Contoh'));
define('APP_ENV', EnvLoader::get('APP_ENV', 'development'));
define('APP_DEBUG', EnvLoader::getBool('APP_DEBUG', true));
define('APP_URL', EnvLoader::get('APP_URL', 'http://localhost'));

// Security Settings
define('JWT_SECRET', EnvLoader::get('JWT_SECRET', 'change-this-secret'));
define('ENCRYPTION_KEY', EnvLoader::get('ENCRYPTION_KEY', 'change-this-32-character-key-here'));
define('SESSION_LIFETIME', EnvLoader::getInt('SESSION_LIFETIME', 7200));
define('CSRF_TOKEN_EXPIRE', EnvLoader::getInt('CSRF_TOKEN_EXPIRE', 3600));

// File Upload Settings
define('MAX_FILE_SIZE', EnvLoader::getInt('MAX_FILE_SIZE', 5242880)); // 5MB default
define('UPLOAD_PATH', EnvLoader::get('UPLOAD_PATH', 'uploads/'));
define('ALLOWED_EXTENSIONS', EnvLoader::get('ALLOWED_EXTENSIONS', 'jpg,jpeg,png,gif,pdf,doc,docx'));

// Rate Limiting
define('RATE_LIMIT_LOGIN', EnvLoader::getInt('RATE_LIMIT_LOGIN', 5));
define('RATE_LIMIT_CONTACT', EnvLoader::getInt('RATE_LIMIT_CONTACT', 3));
define('RATE_LIMIT_WINDOW', EnvLoader::getInt('RATE_LIMIT_WINDOW', 300));

// Logging
define('LOG_LEVEL', EnvLoader::get('LOG_LEVEL', 'info'));
define('LOG_PATH', EnvLoader::get('LOG_PATH', 'logs/'));
define('LOG_MAX_FILES', EnvLoader::getInt('LOG_MAX_FILES', 30));

// Cache Settings
define('CACHE_ENABLED', EnvLoader::getBool('CACHE_ENABLED', false));
define('CACHE_DRIVER', EnvLoader::get('CACHE_DRIVER', 'file'));
define('CACHE_LIFETIME', EnvLoader::getInt('CACHE_LIFETIME', 3600));

// Email Settings
define('MAIL_HOST', EnvLoader::get('MAIL_HOST', 'localhost'));
define('MAIL_PORT', EnvLoader::getInt('MAIL_PORT', 587));
define('MAIL_USERNAME', EnvLoader::get('MAIL_USERNAME', ''));
define('MAIL_PASSWORD', EnvLoader::get('MAIL_PASSWORD', ''));
define('MAIL_ENCRYPTION', EnvLoader::get('MAIL_ENCRYPTION', 'tls'));
define('MAIL_FROM_ADDRESS', EnvLoader::get('MAIL_FROM_ADDRESS', 'noreply@localhost'));
define('MAIL_FROM_NAME', EnvLoader::get('MAIL_FROM_NAME', APP_NAME));

// Error Reporting based on environment
if (APP_ENV === 'production') {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', LOG_PATH . 'php_errors.log');
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Session Configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', APP_ENV === 'production' ? 1 : 0);
ini_set('session.gc_maxlifetime', SESSION_LIFETIME);
ini_set('session.cookie_lifetime', SESSION_LIFETIME);

// Set timezone (sesuaikan dengan lokasi sekolah)
date_default_timezone_set(EnvLoader::get('APP_TIMEZONE', 'Asia/Jakarta'));
?>