<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../Middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../../config.php';

$user = AuthMiddleware::verifyRole(['admin', 'commercial', 'préparateur de commande', 'livreur', 'comptable', 'responsable de stock']);
$role = $user->role;

$autorisations = [
    'admin' => ['GET', 'POST', 'PUT', 'DELETE'],
    'commercial' => ['GET', 'POST', 'PUT', 'DELETE'],
    'préparateur de commande' => ['GET'],
    'livreur' => ['GET'],
    'comptable' => ['GET'],
    'responsable de stock' => ['GET']
];

$method = $_SERVER['REQUEST_METHOD'];
if (!isset($autorisations[$role]) || !in_array($method, $autorisations[$role])) {
    http_response_code(403);
    echo json_encode(['error' => "Accès refusé pour le rôle : $role"]);
    exit;
}

try {
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT * FROM client WHERE idclient=?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                $stmt = $pdo->query("SELECT * FROM client ORDER BY nom ASC");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['nom'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Nom requis']);
                exit;
            }
            $stmt = $pdo->prepare("INSERT INTO client (nom, email, telephone) VALUES (?, ?, ?)");
            $stmt->execute([
                $data['nom'],
                $data['email'] ?? null,
                $data['telephone'] ?? null
            ]);
            echo json_encode(['success' => true, 'idclient' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID client requis']);
                exit;
            }
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE client SET nom=?, email=?, telephone=? WHERE idclient=?");
            $stmt->execute([
                $data['nom'],
                $data['email'] ?? null,
                $data['telephone'] ?? null,
                $_GET['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID client requis']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM client WHERE idclient=?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(['success' => true]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
}
