<?php
require_once 'config/config.php';
require_once 'includes/database.php';
require_once 'includes/auth_middleware.php';

requireAuth();

$type = $_GET['type'] ?? '';
$student_id = $_GET['student_id'] ?? '';

if (empty($type) || empty($student_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Type and student_id are required']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
    $stmt->execute([$student_id]);
    $student = $stmt->fetch();
    
    if (!$student) {
        http_response_code(404);
        echo json_encode(['error' => 'Student not found']);
        exit();
    }
    
    switch ($type) {
        case 'profile':
            $report = [
                'title' => 'Profile Summary Report',
                'student' => $student,
                'generated_at' => date('Y-m-d H:i:s'),
                'fields' => [
                    'Name' => $student['full_name'],
                    'Student ID' => $student['student_id'],
                    'Email' => $student['email'],
                    'Date of Birth' => $student['date_of_birth'],
                    'Course' => $student['course_of_study'],
                    'Enrollment Date' => $student['enrollment_date'],
                    'Status' => $student['status']
                ]
            ];
            break;
            
        case 'confirmation':
            $report = [
                'title' => 'Registration Confirmation Slip',
                'student' => $student,
                'generated_at' => date('Y-m-d H:i:s'),
                'registration_timestamp' => $student['created_at'],
                'course_summary' => $student['course_of_study'],
                'status' => $student['status'],
                'confirmation_number' => 'CONF-' . strtoupper(substr(md5($student['id'] . $student['created_at']), 0, 8))
            ];
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid report type']);
            exit();
    }
    
    echo json_encode(['report' => $report]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to generate report']);
}
?>