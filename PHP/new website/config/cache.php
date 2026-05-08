<?php
// config/cache.php - Simple File-based Caching System

require_once __DIR__ . '/app.php';

class SimpleCache {
    private $cacheDir;
    private $defaultLifetime;
    
    public function __construct($cacheDir = null, $lifetime = null) {
        $this->cacheDir = $cacheDir ?: sys_get_temp_dir() . '/sekolah_cache/';
        $this->defaultLifetime = $lifetime ?: CACHE_LIFETIME;
        
        // Create cache directory if not exists
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }
    
    /**
     * Get item from cache
     */
    public function get($key, $default = null) {
        if (!CACHE_ENABLED) {
            return $default;
        }
        
        $filename = $this->getFilename($key);
        
        if (!file_exists($filename)) {
            return $default;
        }
        
        $data = unserialize(file_get_contents($filename));
        
        // Check if expired
        if ($data['expire'] < time()) {
            $this->delete($key);
            return $default;
        }
        
        return $data['value'];
    }
    
    /**
     * Store item in cache
     */
    public function set($key, $value, $lifetime = null) {
        if (!CACHE_ENABLED) {
            return false;
        }
        
        $lifetime = $lifetime ?: $this->defaultLifetime;
        $filename = $this->getFilename($key);
        
        $data = [
            'value' => $value,
            'expire' => time() + $lifetime,
            'created' => time()
        ];
        
        return file_put_contents($filename, serialize($data)) !== false;
    }
    
    /**
     * Delete item from cache
     */
    public function delete($key) {
        $filename = $this->getFilename($key);
        
        if (file_exists($filename)) {
            return unlink($filename);
        }
        
        return true;
    }
    
    /**
     * Clear all cache
     */
    public function clear() {
        $files = glob($this->cacheDir . '*.cache');
        
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        
        return true;
    }
    
    /**
     * Get cache statistics
     */
    public function getStats() {
        $files = glob($this->cacheDir . '*.cache');
        $totalSize = 0;
        $validFiles = 0;
        $expiredFiles = 0;
        
        foreach ($files as $file) {
            if (is_file($file)) {
                $totalSize += filesize($file);
                $data = unserialize(file_get_contents($file));
                
                if ($data['expire'] < time()) {
                    $expiredFiles++;
                } else {
                    $validFiles++;
                }
            }
        }
        
        return [
            'total_files' => count($files),
            'valid_files' => $validFiles,
            'expired_files' => $expiredFiles,
            'total_size' => $totalSize,
            'cache_dir' => $this->cacheDir
        ];
    }
    
    /**
     * Clean up expired cache files
     */
    public function cleanup() {
        $files = glob($this->cacheDir . '*.cache');
        $cleaned = 0;
        
        foreach ($files as $file) {
            if (is_file($file)) {
                $data = unserialize(file_get_contents($file));
                
                if ($data['expire'] < time()) {
                    unlink($file);
                    $cleaned++;
                }
            }
        }
        
        return $cleaned;
    }
    
    /**
     * Get cache filename for key
     */
    private function getFilename($key) {
        return $this->cacheDir . md5($key) . '.cache';
    }
}

// Global cache instance
$cache = new SimpleCache();

/**
 * Helper function untuk caching
 */
function cache_remember($key, $callback, $lifetime = null) {
    global $cache;
    
    $value = $cache->get($key);
    
    if ($value === null) {
        $value = $callback();
        $cache->set($key, $value, $lifetime);
    }
    
    return $value;
}
?>