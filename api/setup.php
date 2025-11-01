<?php
require_once 'includes/database.php';

// Create default admin user (run once)
$username = 'admin';
$password = 'Password';
$email = 'admin@excellence-institute.com';

try {
    // Check if admin already exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);

    if ($stmt->fetchColumn() == 0) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)");
        $stmt->execute([$username, $hashedPassword, $email]);

        echo json_encode([
            'success' => true,
            'message' => 'Admin user created successfully',
            'credentials' => [
                'username' => $username,
                'password' => $password
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Admin user already exists'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Setup failed: ' . $e->getMessage()]);
}
?>