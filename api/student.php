<?php
require_once 'config/config.php';
require_once 'includes/database.php';
require_once 'includes/auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Student ID is required']);
    exit();
}

switch ($method) {
    case 'GET':
        try {
            // Try to find by student_id first (for student portal), then by database id (for admin)
            $stmt = $pdo->prepare("SELECT * FROM students WHERE student_id = ? OR id = ?");
            $stmt->execute([$id, $id]);
            $student = $stmt->fetch();
            
            if (!$student) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Student not found']);
            } else {
                echo json_encode(['success' => true, 'student' => $student]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to fetch student']);
        }
        break;
        
    case 'PUT':
        requireAuth(); // Admin only
        $input = json_decode(file_get_contents('php://input'), true);
        
        $errors = [];
        $full_name = trim($input['full_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $date_of_birth = $input['date_of_birth'] ?? '';
        $course_of_study = trim($input['course_of_study'] ?? '');
        
        if (empty($full_name)) $errors[] = "Full name is required";
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
        if (empty($date_of_birth)) $errors[] = "Date of birth is required";
        if (empty($course_of_study)) $errors[] = "Course of study is required";
        
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            exit();
        }
        
        try {
            $stmt = $pdo->prepare("UPDATE students SET full_name = ?, email = ?, date_of_birth = ?, course_of_study = ? WHERE id = ?");
            $result = $stmt->execute([$full_name, $email, $date_of_birth, $course_of_study, $id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Student updated successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Student not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update student']);
        }
        break;
        
    case 'DELETE':
        requireAuth(); // Admin only
        try {
            // Log deletion for recovery
            $stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
            $stmt->execute([$id]);
            $student = $stmt->fetch();
            
            if ($student) {
                file_put_contents('deleted_students.log', date('Y-m-d H:i:s') . " - Deleted: " . json_encode($student) . "\n", FILE_APPEND);
                
                $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
                $stmt->execute([$id]);
                
                echo json_encode(['success' => true, 'message' => 'Student deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Student not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete student']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>