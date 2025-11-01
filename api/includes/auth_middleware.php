<?php
function requireAuth() {
    session_start();
    if (!isset($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit();
    }
}

function isAdmin() {
    session_start();
    return isset($_SESSION['admin_id']);
}
?>