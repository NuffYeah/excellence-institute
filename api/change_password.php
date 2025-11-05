<?php
require_once 'config/config.php';
require_once 'includes/database.php';
require_once 'includes/auth_middleware.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Verify admin is authenticated (session-based)
requireAuth();
$adminId = $_SESSION['admin_id'];

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['current_password']) || !isset($input['new_password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Current password and new password required']);
    exit;
}

try {
    // Verify current password
    $stmt = $pdo->prepare("SELECT password FROM admin_users WHERE id = ?");
    $stmt->execute([$adminId]);
    $currentHash = $stmt->fetchColumn();
    
    if (!password_verify($input['current_password'], $currentHash)) {
        http_response_code(400);
        echo json_encode(['error' => 'Current password is incorrect']);
        exit;
    }
    
    // Update password
    $newHash = password_hash($input['new_password'], PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE admin_users SET password = ? WHERE id = ?");
    $stmt->execute([$newHash, $adminId]);
    
    echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>