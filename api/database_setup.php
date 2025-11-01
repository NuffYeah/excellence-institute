<?php
require_once 'config/config.php';

try {
    // Connect without database first
    $pdo = new PDO("mysql:host=" . DB_HOST . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
    $pdo->exec("USE " . DB_NAME);
    
    // Create admin_users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Create students table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_id VARCHAR(20) UNIQUE NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            date_of_birth DATE NOT NULL,
            course_of_study VARCHAR(100) NOT NULL,
            enrollment_date DATE NOT NULL,
            status ENUM('Active', 'Pending', 'Inactive') DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    
    // Create default admin user
    $username = 'admin';
    $password = 'admin123';
    $email = 'admin@excellence-institute.com';
    
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    
    if ($stmt->fetchColumn() == 0) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword]);
        
        // Create a test student for testing
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM students WHERE student_id = ?");
        $stmt->execute(['STU001']);
        
        if ($stmt->fetchColumn() == 0) {
            $stmt = $pdo->prepare("INSERT INTO students (student_id, full_name, email, date_of_birth, course_of_study, enrollment_date) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                'STU001',
                'John Doe',
                'john.doe@example.com',
                '2000-01-15',
                'Computer Science',
                date('Y-m-d')
            ]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Database and admin user created successfully',
            'credentials' => [
                'username' => $username,
                'password' => $password
            ],
            'test_student' => 'STU001'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'Database setup complete, admin user already exists'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database setup failed: ' . $e->getMessage()]);
}
?>