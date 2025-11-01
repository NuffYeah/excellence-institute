<?php
// Test script to demonstrate student ID generation
require_once 'config/config.php';
require_once 'includes/database.php';

// Function to generate unique student ID (same as in register.php)
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

// Test examples
$testCases = [
    [
        'enrollment_date' => '2024-01-15',
        'course_of_study' => 'Computer Science',
        'date_of_birth' => '2000-05-20'
    ],
    [
        'enrollment_date' => '2024-02-10',
        'course_of_study' => 'Business Administration',
        'date_of_birth' => '1999-12-03'
    ],
    [
        'enrollment_date' => '2024-03-05',
        'course_of_study' => 'Engineering',
        'date_of_birth' => '2001-08-15'
    ]
];

echo "<h2>Student ID Generation Examples</h2>";
echo "<p><strong>Format:</strong> YY + CourseCode(2 letters) + MMDD(birth month/day)</p>";
echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
echo "<tr><th>Enrollment Date</th><th>Course</th><th>Date of Birth</th><th>Generated ID</th><th>Explanation</th></tr>";

foreach ($testCases as $case) {
    $generatedId = generateStudentId($pdo, $case['enrollment_date'], $case['course_of_study'], $case['date_of_birth']);
    
    $year = date('y', strtotime($case['enrollment_date']));
    $courseCode = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $case['course_of_study']), 0, 2));
    $birthMonth = date('m', strtotime($case['date_of_birth']));
    $birthDay = date('d', strtotime($case['date_of_birth']));
    
    $explanation = "Year: {$year}, Course: {$courseCode}, Birth: {$birthMonth}{$birthDay}";
    
    echo "<tr>";
    echo "<td>{$case['enrollment_date']}</td>";
    echo "<td>{$case['course_of_study']}</td>";
    echo "<td>{$case['date_of_birth']}</td>";
    echo "<td><strong>{$generatedId}</strong></td>";
    echo "<td>{$explanation}</td>";
    echo "</tr>";
}

echo "</table>";
?>