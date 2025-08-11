<?php
// En-têtes HTTP
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Affichage des erreurs (à désactiver en prod)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Requête OPTIONS (préflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../Middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../../config.php'; // Connexion PDO

// Vérification token + rôle
$user = AuthMiddleware::verifyRole(['admin', 'commercial', 'préparateur de commande', 'responsable de stock']);
$role = $user->role;

// Permissions par rôle
$autorisations = [
    'admin' => ['GET', 'POST', 'PUT', 'DELETE'],
    'commercial' => ['GET', 'POST', 'PUT', 'DELETE'],
    'préparateur de commande' => ['GET'],
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
                $stmt = $pdo->prepare("SELECT * FROM lot WHERE idlot = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                $stmt = $pdo->query("SELECT * FROM lot");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['nom_lot'])) {
                http_response_code(400);
                echo json_encode(['error' => 'nom_lot requis']);
                exit;
            }
            $stmt = $pdo->prepare("INSERT INTO lot (nom_lot, description, date_creation) 
                                   VALUES (?, ?, ?)");
            $stmt->execute([
                $data['nom_lot'],
                $data['description'] ?? null,
                $data['date_creation'] ?? date('Y-m-d')
            ]);
            echo json_encode(['success' => true, 'idlot' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID lot requis']);
                exit;
            }
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE lot 
                                   SET nom_lot=?, description=?, date_creation=? 
                                   WHERE idlot=?");
            $stmt->execute([
                $data['nom_lot'],
                $data['description'] ?? null,
                $data['date_creation'] ?? date('Y-m-d'),
                $_GET['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID lot requis']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM lot WHERE idlot=?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
}
