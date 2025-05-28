<?php
session_start();

// Autorisation des requêtes CORS
header("Access-Control-Allow-Origin: http://web");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Gestion des erreurs : log dans un fichier
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../php-error.log');

// En-tête JSON
header('Content-Type: application/json');

try {
    require_once __DIR__ . '/../../Controllers/authController.php';

    $data = json_decode(file_get_contents("php://input"), true);

    if ($data) {
        $auth = new AuthController();
        $result = $auth->login($data); // ⚠️ Assure-toi que cette méthode existe et fonctionne

        if ($result['status'] === 'success') {
            echo json_encode([
                'status' => 'success',
                'message' => 'Connexion réussie'
            ]);
        } else {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => $result['message']
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Données manquantes'
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur serveur : ' . $e->getMessage()
    ]);
}
?>
