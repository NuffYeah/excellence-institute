<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'excellence_institute');
define('DB_USER', 'naph');
define('DB_PASS', 'password');

// Application constants
define('SITE_NAME', 'Excellence Institute');
define('API_BASE_URL', 'http://localhost/excellence-institute/api/');

// Student status constants
define('STATUS_ACTIVE', 'Active');
define('STATUS_PENDING', 'Pending');
define('STATUS_INACTIVE', 'Inactive');

// CORS headers for React frontend (allow only whitelisted dev origins)
$allowed_origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (in_array($origin, $allowed_origins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    http_response_code(200);
    exit();
}

// Session configuration for cross-origin requests
ini_set('session.cookie_samesite', 'Lax');
ini_set('session.cookie_secure', 'false');
ini_set('session.cookie_httponly', 'true');
ini_set('session.use_cookies', '1');
ini_set('session.use_only_cookies', '1');
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

error_reporting(E_ALL);
ini_set('display_errors', 1);
?>