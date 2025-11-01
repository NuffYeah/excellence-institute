<?php
require_once 'config/config.php';
require_once 'includes/database.php';

// Debug authentication issues
echo "=== AUTH DEBUG ===\n";

// Check if we can connect to database
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM admin_users");
    echo "Database connection: OK\n";
    echo "Admin users count: " . $stmt->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "Database error: " . $e->getMessage() . "\n";
    exit;
}

// Test login with known credentials
$testUsername = 'admin';
$testPassword = 'admin123';

echo "\nTesting login with: $testUsername / $testPassword\n";

try {
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
    $stmt->execute([$testUsername]);
    $admin = $stmt->fetch();
    
    if ($admin) {
        echo "User found in database\n";
        echo "Stored password hash: " . substr($admin['password'], 0, 20) . "...\n";
        
        if (password_verify($testPassword, $admin['password'])) {
            echo "Password verification: SUCCESS\n";
        } else {
            echo "Password verification: FAILED\n";
            
            // Try creating a new hash for comparison
            $newHash = password_hash($testPassword, PASSWORD_DEFAULT);
            echo "New hash would be: " . substr($newHash, 0, 20) . "...\n";
        }
    } else {
        echo "User NOT found in database\n";
        
        // List all users
        $stmt = $pdo->query("SELECT username FROM admin_users");
        $users = $stmt->fetchAll();
        echo "Available users: " . json_encode(array_column($users, 'username')) . "\n";
    }
} catch (Exception $e) {
    echo "Query error: " . $e->getMessage() . "\n";
}

// Test session functionality
echo "\nTesting session...\n";
session_start();
$_SESSION['test'] = 'working';
echo "Session test: " . ($_SESSION['test'] === 'working' ? 'OK' : 'FAILED') . "\n";

echo "\n=== END DEBUG ===\n";
?>