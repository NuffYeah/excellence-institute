<?php
require_once 'config/config.php';
require_once 'includes/database.php';
require_once 'includes/auth_middleware.php';

// Require admin authentication
requireAuth();

// Function to generate unique student ID
function generateStudentId($pdo, $enrollment_date, $course_of_study, $date_of_birth) {
    // Get year from enrollment date
    $year = date('y', strtotime($enrollment_date));
    
    // Get course code (first 2 letters)
    $courseCode = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $course_of_study), 0, 2));
    
    // Get birth month and day
    $birthMonth = date('m', strtotime($date_of_birth));
    $birthDay = date('d', strtotime($date_of_birth));
    
    // Base ID format: YY + CourseCode + MMDD
    $baseId = $year . $courseCode . $birthMonth . $birthDay;
    
    // Check if ID exists and add suffix if needed
    $counter = 1;
    $studentId = $baseId;
    
    while (true) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM students WHERE student_id = ?");
        $stmt->execute([$studentId]);
        
        if ($stmt->fetchColumn() == 0) {
            break;
        }
        
        $studentId = $baseId . sprintf('%02d', $counter);
        $counter++;
    }
    
    return $studentId;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

$errors = [];
$full_name = trim($input['full_name'] ?? '');
$email = trim($input['email'] ?? '');
$date_of_birth = $input['date_of_birth'] ?? '';
$course_of_study = trim($input['course_of_study'] ?? '');
$enrollment_date = $input['enrollment_date'] ?? '';

// Validation
if (empty($full_name)) $errors[] = "Full name is required";
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required";
if (empty($date_of_birth)) $errors[] = "Date of birth is required";
if (empty($course_of_study)) $errors[] = "Course of study is required";
if (empty($enrollment_date)) $errors[] = "Enrollment date is required";

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit();
}

try {
    // Generate unique student ID
    $student_id = generateStudentId($pdo, $enrollment_date, $course_of_study, $date_of_birth);
    
    $stmt = $pdo->prepare("INSERT INTO students (student_id, full_name, email, date_of_birth, course_of_study, enrollment_date) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$student_id, $full_name, $email, $date_of_birth, $course_of_study, $enrollment_date]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Student registered successfully',
        'generated_student_id' => $student_id,
        'id' => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already exists']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed']);
    }
}
?>