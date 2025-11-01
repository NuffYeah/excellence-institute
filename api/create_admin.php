<?php
require_once 'config/config.php';
require_once 'includes/database.php';

// Remove this file after creating admin!
$username = 'admin';
$email = 'admin@excellence-institute.com';
$password = password_hash('admin123', PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $password]);
    echo "Admin created successfully! Username: $username, Password: admin123";
    echo "\nDELETE THIS FILE NOW!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>