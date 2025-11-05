<?php
require_once 'config/config.php';
require_once 'includes/database.php';

require_once 'includes/auth_middleware.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    $search = $_GET['search'] ?? '';
    $course = $_GET['course'] ?? '';
    
    $sql = "SELECT * FROM students WHERE 1=1";
    $params = [];
    
    if (!empty($search)) {
        $sql .= " AND (full_name LIKE ? OR student_id LIKE ? OR email LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm]);
    }
    
    if (!empty($course)) {
        $sql .= " AND course_of_study = ?";
        $params[] = $course;
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $students = $stmt->fetchAll();
    
    echo json_encode(['students' => $students]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch students']);
}
?>