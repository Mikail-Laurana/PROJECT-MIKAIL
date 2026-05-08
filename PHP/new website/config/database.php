<?php
// File: config/database.php
// Konfigurasi koneksi database

// Load environment variables
require_once __DIR__ . '/env.php';

// Pengaturan database dari environment variables
define('DB_HOST', EnvLoader::get('DB_HOST', 'localhost'));
define('DB_NAME', EnvLoader::get('DB_NAME', 'sekolah_db'));
define('DB_USER', EnvLoader::get('DB_USERNAME', 'root'));
define('DB_PASS', EnvLoader::get('DB_PASSWORD', ''));

// Class untuk koneksi database
class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $conn;

    // Fungsi untuk membuat koneksi PDO
    public function connect() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names " . EnvLoader::get('DB_CHARSET', 'utf8'));
        } catch(PDOException $e) {
            if (EnvLoader::isDebug()) {
                echo "Koneksi gagal: " . $e->getMessage();
            } else {
                error_log("Database connection failed: " . $e->getMessage());
                echo "Terjadi kesalahan koneksi database.";
            }
        }
        
        return $this->conn;
    }
}

// Class untuk koneksi MySQLi (untuk backward compatibility)
class MySQLiDB {
    private $conn;
    
    public function __construct() {
        $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($this->conn->connect_error) {
            die("Koneksi gagal: " . $this->conn->connect_error);
        }
        
        $this->conn->set_charset("utf8mb4");
    }
    
    public function getConnection() {
        return $this->conn;
    }
    
    public function close() {
        $this->conn->close();
    }
}

// Fungsi helper untuk mendapatkan koneksi PDO
function getConnection() {
    $database = new Database();
    return $database->connect();
}

// Fungsi helper untuk mendapatkan koneksi MySQLi
function getMySQLiConnection() {
    $db = new MySQLiDB();
    return $db->getConnection();
}
?>