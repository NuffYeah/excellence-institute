<?php
require_once 'config/config.php';
require_once 'includes/database.php';

try {
    // Test database connection
    echo "Database connection: OK\n";
    
    // Check if admin_users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
    if ($stmt->rowCount() == 0) {
        // Create admin_users table
        $sql = "CREATE TABLE admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $pdo->exec($sql);
        echo "Created admin_users table\n";
        
        // Create default admin user
        $username = 'admin';
        $password = 'admin123';
        $email = 'admin@excellence-institute.com';
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)");
        $stmt->execute([$username, $hashedPassword, $email]);
        echo "Created admin user: $username / $password\n";
    } else {
        echo "admin_users table exists\n";
    }
    
    // Check if students table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'students'");
    if ($stmt->rowCount() == 0) {
        // Create students table
        $sql = "CREATE TABLE students (
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
        )";
        $pdo->exec($sql);
        echo "Created students table\n";
    } else {
        echo "students table exists\n";
    }
    
    echo json_encode(['success' => true, 'message' => 'Database setup complete']);
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
    echo json_encode(['error' => $e->getMessage()]);
}
?>