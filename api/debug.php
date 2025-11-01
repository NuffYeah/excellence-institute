<?php
// Simple debug script to identify issues
echo "PHP Version: " . phpversion() . "<br>";
echo "Current Directory: " . __DIR__ . "<br>";

// Test 1: Check if config file exists
$configPath = __DIR__ . '/config/config.php';
echo "Config path: $configPath<br>";
echo "Config exists: " . (file_exists($configPath) ? 'YES' : 'NO') . "<br>";

if (file_exists($configPath)) {
    try {
        require_once $configPath;
        echo "Config loaded successfully<br>";
        echo "DB_HOST: " . (defined('DB_HOST') ? DB_HOST : 'NOT DEFINED') . "<br>";
        echo "DB_NAME: " . (defined('DB_NAME') ? DB_NAME : 'NOT DEFINED') . "<br>";
        echo "DB_USER: " . (defined('DB_USER') ? DB_USER : 'NOT DEFINED') . "<br>";
    } catch (Exception $e) {
        echo "Config error: " . $e->getMessage() . "<br>";
    }
} else {
    echo "Config file not found!<br>";
}

// Test 2: Try basic MySQL connection
try {
    $host = 'localhost';
    $dbname = 'excellence_institute';
    $user = 'root';
    $pass = '';
    
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass);
    echo "MySQL connection: SUCCESS<br>";
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE '$dbname'");
    if ($stmt->rowCount() > 0) {
        echo "Database '$dbname' exists<br>";
    } else {
        echo "Database '$dbname' does NOT exist - creating it...<br>";
        $pdo->exec("CREATE DATABASE $dbname");
        echo "Database '$dbname' created<br>";
    }
    
} catch (PDOException $e) {
    echo "MySQL connection FAILED: " . $e->getMessage() . "<br>";
}

echo "Debug complete.";
?>