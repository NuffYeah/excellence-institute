<?php
require_once 'config/config.php';
require_once 'includes/database.php';

$type = $_GET['type'] ?? 'profile';
$id = $_GET['id'] ?? '';

if (empty($id)) {
    http_response_code(400);
    echo 'Missing required parameter: id';
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM students WHERE student_id = ? OR id = ? LIMIT 1");
    $stmt->execute([$id, $id]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(404);
        echo 'Student not found';
        exit();
    }

    $generatedAt = date('Y-m-d H:i:s');

    $fullName = htmlspecialchars($student['full_name'] ?? '');
    $studentId = htmlspecialchars($student['student_id'] ?? '');
    $email = htmlspecialchars($student['email'] ?? '');
    $dob = !empty($student['date_of_birth']) ? date('d M Y', strtotime($student['date_of_birth'])) : '';
    $course = htmlspecialchars($student['course_of_study'] ?? '');
    $enrollment = !empty($student['enrollment_date']) ? date('d M Y', strtotime($student['enrollment_date'])) : '';
    $status = htmlspecialchars($student['status'] ?? 'Active');
    $created = !empty($student['created_at']) ? date('d M Y', strtotime($student['created_at'])) : $enrollment;
    $confirmationNumber = 'CONF-' . strtoupper(substr(md5(($student['id'] ?? '') . ($student['created_at'] ?? $generatedAt)), 0, 8));

    $title = $type === 'confirmation' ? 'Registration Confirmation Slip' : 'Profile Summary Report';

    header('Content-Type: text/html; charset=utf-8');

    echo '<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>'. $title .'</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
      .header { text-align: center; margin-bottom: 30px; }
      .field { margin: 10px 0; }
      .label { font-weight: 600; display:inline-block; min-width: 200px; }
      .print-btns { margin: 20px 0; }
      .print-btns button { margin-right: 10px; padding: 8px 14px; }
      @media print { .print-btns { display: none; } }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Excellence Institute</h1>
      <h2>'. $title .'</h2>
      <p>Generated: '. htmlspecialchars($generatedAt) .'</p>
    </div>
';

    if ($type === 'confirmation') {
        echo '<div class="field"><span class="label">Student Name:</span> '. $fullName .'</div>';
        echo '<div class="field"><span class="label">Student ID:</span> '. $studentId .'</div>';
        echo '<div class="field"><span class="label">Course:</span> '. $course .'</div>';
        echo '<div class="field"><span class="label">Registration Date:</span> '. htmlspecialchars($created) .'</div>';
        echo '<div class="field"><span class="label">Status:</span> '. $status .'</div>';
        echo '<div class="field"><span class="label">Confirmation Number:</span> '. htmlspecialchars($confirmationNumber) .'</div>';
    } else {
        echo '<div class="field"><span class="label">Full Name:</span> '. $fullName .'</div>';
        echo '<div class="field"><span class="label">Student ID:</span> '. $studentId .'</div>';
        echo '<div class="field"><span class="label">Email:</span> '. $email .'</div>';
        echo '<div class="field"><span class="label">Date of Birth:</span> '. htmlspecialchars($dob) .'</div>';
        echo '<div class="field"><span class="label">Course:</span> '. $course .'</div>';
        echo '<div class="field"><span class="label">Enrollment Date:</span> '. htmlspecialchars($enrollment) .'</div>';
        echo '<div class="field"><span class="label">Status:</span> '. $status .'</div>';
    }

    echo '    <div class="print-btns">
      <button onclick="window.print()">Print</button>
      <button onclick="window.close()">Close</button>
    </div>
    ';

    if (!empty($_GET['auto_print'])) {
        echo '<script>window.addEventListener("load", function(){ try{ window.print(); }catch(e){} });</script>';
    }

    echo '
  </body>
</html>';

} catch (PDOException $e) {
    http_response_code(500);
    echo 'Failed to generate report';
}
