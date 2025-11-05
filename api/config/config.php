<?php
// Database configuration
// Environment and database config (env-first, then defaults)
if (!defined('APP_ENV')) {
    $appEnv = getenv('APP_ENV');
    define('APP_ENV', $appEnv !== false ? strtolower($appEnv) : 'development');
}
define('DB_HOST', getenv('DB_HOST') !== false ? getenv('DB_HOST') : 'localhost');
define('DB_NAME', getenv('DB_NAME') !== false ? getenv('DB_NAME') : 'excellence_institute');
define('DB_USER', getenv('DB_USER') !== false ? getenv('DB_USER') : 'naph');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'password');

// Application constants
define('SITE_NAME', 'Excellence Institute');
define('API_BASE_URL', getenv('API_BASE_URL') !== false ? getenv('API_BASE_URL') : 'http://localhost/excellence-institute/api/');

// Student status constants
define('STATUS_ACTIVE', 'Active');
define('STATUS_PENDING', 'Pending');
define('STATUS_INACTIVE', 'Inactive');
if (!defined('ADMIN_REGISTRATION_ENABLED')) {
    $val = getenv('ADMIN_REGISTRATION_ENABLED');
    define('ADMIN_REGISTRATION_ENABLED', $val !== false ? filter_var($val, FILTER_VALIDATE_BOOLEAN) : false);
}
if (!defined('DELETED_STUDENTS_LOG')) {
    $logPath = getenv('DELETED_STUDENTS_LOG');
    if ($logPath === false || $logPath === '') {
        $logPath = 'C:\\ProgramData\\excellence-institute\\logs\\deleted_students.log';
    }
    define('DELETED_STUDENTS_LOG', $logPath);
}

// Environment helpers
$isProd = (APP_ENV === 'production');
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

// CORS headers for React frontend (allow only whitelisted dev origins)
$allowed_origins_env = getenv('ALLOWED_ORIGINS');
if ($allowed_origins_env !== false && $allowed_origins_env !== '') {
    $allowed_origins = array_map('trim', explode(',', $allowed_origins_env));
} else {
    $allowed_origins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ];
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');
// Baseline security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
if ($isProd && $isHttps) {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
}
header("Content-Security-Policy: frame-ancestors 'none'");

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
$secureCookie = ($isHttps && $isProd) ? '1' : '0';
$sameSite = 'Lax';
ini_set('session.cookie_samesite', $sameSite);
ini_set('session.cookie_secure', $secureCookie);
ini_set('session.cookie_httponly', '1');
ini_set('session.use_cookies', '1');
ini_set('session.use_only_cookies', '1');
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 3600,
        'path' => '/',
        'secure' => ($secureCookie === '1'),
        'httponly' => true,
        'samesite' => $sameSite
    ]);
}

error_reporting(E_ALL);
if ($isProd) {
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    $phpLogDir = 'C:\\ProgramData\\excellence-institute\\logs';
    if (!is_dir($phpLogDir)) { @mkdir($phpLogDir, 0777, true); }
    ini_set('error_log', $phpLogDir . DIRECTORY_SEPARATOR . 'php_errors.log');
} else {
    ini_set('display_errors', 1);
}
?>