<?php
require_once 'config/config.php';
require_once 'includes/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$courses = [
    'Computer Science',
    'Business Administration', 
    'Engineering',
    'Medicine',
    'Psychology',
    'Mathematics',
    'Physics',
    'Chemistry'
];

echo json_encode(['courses' => $courses]);
?>