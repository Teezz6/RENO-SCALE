<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Stoppe ici si c’est une requête OPTIONS (préflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../Controllers/authController.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $auth = new AuthController();
    $result = $auth->login($data);

    if ($result['status'] === 'success') {
        echo json_encode(['message' => 'Connexion réussie']);
    } else {
        http_response_code(400);
        echo json_encode(['message' => $result['message']]);
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Données manquantes']);
}
?>
