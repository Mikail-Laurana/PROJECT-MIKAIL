<?php
// config/upload.php - File Upload Handler

require_once __DIR__ . '/app.php';

class FileUploader {
    private $uploadPath;
    private $maxFileSize;
    private $allowedExtensions;
    
    public function __construct($uploadPath = null) {
        $this->uploadPath = $uploadPath ?: UPLOAD_PATH;
        $this->maxFileSize = MAX_FILE_SIZE;
        $this->allowedExtensions = explode(',', ALLOWED_EXTENSIONS);
        
        // Create upload directory if not exists
        if (!is_dir($this->uploadPath)) {
            mkdir($this->uploadPath, 0755, true);
        }
    }
    
    /**
     * Upload single file
     */
    public function upload($file, $subfolder = '') {
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            throw new Exception('No file uploaded');
        }
        
        // Validate file
        $this->validateFile($file);
        
        // Generate safe filename
        $filename = $this->generateFilename($file['name']);
        $targetPath = $this->uploadPath . $subfolder;
        
        // Create subfolder if needed
        if ($subfolder && !is_dir($targetPath)) {
            mkdir($targetPath, 0755, true);
        }
        
        $fullPath = $targetPath . '/' . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
            throw new Exception('Failed to move uploaded file');
        }
        
        return [
            'filename' => $filename,
            'path' => $fullPath,
            'url' => $this->getFileUrl($subfolder . '/' . $filename),
            'size' => filesize($fullPath),
            'type' => $file['type']
        ];
    }
    
    /**
     * Upload multiple files
     */
    public function uploadMultiple($files, $subfolder = '') {
        $results = [];
        
        // Handle multiple file upload format
        if (isset($files['name']) && is_array($files['name'])) {
            $fileCount = count($files['name']);
            
            for ($i = 0; $i < $fileCount; $i++) {
                if (empty($files['tmp_name'][$i])) continue;
                
                $file = [
                    'name' => $files['name'][$i],
                    'type' => $files['type'][$i],
                    'tmp_name' => $files['tmp_name'][$i],
                    'error' => $files['error'][$i],
                    'size' => $files['size'][$i]
                ];
                
                try {
                    $results[] = $this->upload($file, $subfolder);
                } catch (Exception $e) {
                    $results[] = ['error' => $e->getMessage()];
                }
            }
        }
        
        return $results;
    }
    
    /**
     * Validate uploaded file
     */
    private function validateFile($file) {
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception($this->getUploadErrorMessage($file['error']));
        }
        
        // Check file size
        if ($file['size'] > $this->maxFileSize) {
            $maxSize = $this->formatFileSize($this->maxFileSize);
            throw new Exception("File size exceeds maximum allowed size of {$maxSize}");
        }
        
        // Check file extension
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $this->allowedExtensions)) {
            $allowed = implode(', ', $this->allowedExtensions);
            throw new Exception("File type not allowed. Allowed types: {$allowed}");
        }
        
        // Check if file is actually an image (for image uploads)
        if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
            $imageInfo = getimagesize($file['tmp_name']);
            if ($imageInfo === false) {
                throw new Exception('Invalid image file');
            }
        }
    }
    
    /**
     * Generate safe filename
     */
    private function generateFilename($originalName) {
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $basename = pathinfo($originalName, PATHINFO_FILENAME);
        
        // Clean basename
        $basename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $basename);
        $basename = trim($basename, '_');
        
        // Add timestamp to avoid conflicts
        $timestamp = date('YmdHis');
        
        return $basename . '_' . $timestamp . '.' . $extension;
    }
    
    /**
     * Get file URL
     */
    private function getFileUrl($relativePath) {
        return APP_URL . '/' . $this->uploadPath . $relativePath;
    }
    
    /**
     * Format file size for display
     */
    private function formatFileSize($bytes) {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        
        while ($bytes >= 1024 && $i < 3) {
            $bytes /= 1024;
            $i++;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
    
    /**
     * Get upload error message
     */
    private function getUploadErrorMessage($errorCode) {
        switch ($errorCode) {
            case UPLOAD_ERR_INI_SIZE:
                return 'File size exceeds server limit';
            case UPLOAD_ERR_FORM_SIZE:
                return 'File size exceeds form limit';
            case UPLOAD_ERR_PARTIAL:
                return 'File was only partially uploaded';
            case UPLOAD_ERR_NO_FILE:
                return 'No file was uploaded';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Missing temporary folder';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Failed to write file to disk';
            case UPLOAD_ERR_EXTENSION:
                return 'File upload stopped by extension';
            default:
                return 'Unknown upload error';
        }
    }
    
    /**
     * Delete uploaded file
     */
    public function delete($filename, $subfolder = '') {
        $filePath = $this->uploadPath . $subfolder . '/' . $filename;
        
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        
        return true;
    }
    
    /**
     * Get file info
     */
    public function getFileInfo($filename, $subfolder = '') {
        $filePath = $this->uploadPath . $subfolder . '/' . $filename;
        
        if (!file_exists($filePath)) {
            return null;
        }
        
        return [
            'filename' => $filename,
            'path' => $filePath,
            'url' => $this->getFileUrl($subfolder . '/' . $filename),
            'size' => filesize($filePath),
            'type' => mime_content_type($filePath),
            'modified' => filemtime($filePath)
        ];
    }
}

// Global uploader instance
$uploader = new FileUploader();
?>