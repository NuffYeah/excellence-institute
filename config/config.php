<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'excellence_institute');
define('DB_USER', 'naph');
define('DB_PASS', 'password');

// Application constants
define('SITE_NAME', 'Excellence Institute');
define('BASE_URL', 'http://localhost/excellence-institute/');

// Student status constants
define('STATUS_ACTIVE', 'Active');
define('STATUS_PENDING', 'Pending');
define('STATUS_INACTIVE', 'Inactive');

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>