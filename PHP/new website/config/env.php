<?php
// config/env.php - Environment Variables Loader

class EnvLoader {
    private static $loaded = false;
    
    /**
     * Load environment variables from .env file
     */
    public static function load($file = null) {
        if (self::$loaded) {
            return; // Sudah dimuat sebelumnya
        }
        
        if ($file === null) {
            $file = dirname(__DIR__) . '/.env';
        }
        
        if (!file_exists($file)) {
            throw new Exception('.env file not found at: ' . $file);
        }
        
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            
            // Skip empty lines
            if (empty(trim($line))) {
                continue;
            }
            
            // Parse key=value
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                $value = trim($value, '"\'');
                
                // Set environment variable
                $_ENV[$key] = $value;
                putenv($key . '=' . $value);
            }
        }
        
        self::$loaded = true;
    }
    
    /**
     * Get environment variable with default fallback
     */
    public static function get($key, $default = null) {
        return $_ENV[$key] ?? getenv($key) ?: $default;
    }
    
    /**
     * Get boolean environment variable
     */
    public static function getBool($key, $default = false) {
        $value = self::get($key, $default);
        if (is_bool($value)) {
            return $value;
        }
        return in_array(strtolower($value), ['true', '1', 'yes', 'on']);
    }
    
    /**
     * Get integer environment variable
     */
    public static function getInt($key, $default = 0) {
        return (int) self::get($key, $default);
    }
    
    /**
     * Check if running in production
     */
    public static function isProduction() {
        return self::get('APP_ENV') === 'production';
    }
    
    /**
     * Check if debug mode is enabled
     */
    public static function isDebug() {
        return self::getBool('APP_DEBUG', false);
    }
}

// Auto-load environment variables when this file is included
try {
    EnvLoader::load();
} catch (Exception $e) {
    // In production, you might want to log this error instead
    if (!EnvLoader::getBool('APP_DEBUG', false)) {
        error_log('Environment loading failed: ' . $e->getMessage());
    } else {
        throw $e;
    }
}
?>