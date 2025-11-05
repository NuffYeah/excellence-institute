<?php
require_once 'config/config.php';
require_once 'includes/database.php';

// Enable error logging
error_log("Auth request: " . $_SERVER['REQUEST_METHOD'] . " from " . ($_SERVER['HTTP_ORIGIN'] ?? 'unknown'));

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Login
        $input = json_decode(file_get_contents('php://input'), true);
        $username = trim($input['username'] ?? '');
        $password = $input['password'] ?? '';
        
        error_log("Login attempt for username: $username");
        
        if (empty($username) || empty($password)) {
            error_log("Login failed: Missing credentials");
            http_response_code(400);
            echo json_encode(['error' => 'Username and password required']);
            exit();
        }
        
        try {
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
            $stmt->execute([$username]);
            $admin = $stmt->fetch();
            
            if ($admin) {
                error_log("User found: " . $admin['username']);
                if (password_verify($password, $admin['password'])) {
                    error_log("Password verified successfully");
                    session_start();
                    $_SESSION['admin_id'] = $admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    
                    echo json_encode([
                        'success' => true,
                        'admin' => [
                            'id' => $admin['id'],
                            'username' => $admin['username'],
                            'email' => $admin['email']
                        ]
                    ]);
                } else {
                    error_log("Password verification failed");
                    http_response_code(401);
                    echo json_encode(['error' => 'Invalid credentials']);
                }
            } else {
                error_log("User not found: $username");
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Login failed']);
        }
        break;
        
    case 'PUT':
        // Register admin (disabled by default; set ADMIN_REGISTRATION_ENABLED=true to enable)
        if (!defined('ADMIN_REGISTRATION_ENABLED') || ADMIN_REGISTRATION_ENABLED !== true) {
            http_response_code(403);
            echo json_encode(['error' => 'Admin registration is disabled']);
            break;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $username = trim($input['username'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';
        
        if (empty($username) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'All fields required']);
            exit();
        }
        
        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)");
            $stmt->execute([$username, $email, $hashedPassword]);
            
            echo json_encode(['success' => true, 'message' => 'Admin created']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed']);
        }
        break;
        
    case 'GET':
        // Check session
        session_start();
        error_log("Session check - admin_id: " . ($_SESSION['admin_id'] ?? 'not set'));
        if (isset($_SESSION['admin_id'])) {
            echo json_encode([
                'authenticated' => true,
                'admin' => [
                    'id' => $_SESSION['admin_id'],
                    'username' => $_SESSION['admin_username']
                ]
            ]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
        break;
        
    case 'DELETE':
        // Logout
        session_start();
        session_destroy();
        error_log("User logged out");
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>