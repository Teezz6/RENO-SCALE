<?php
// En-têtes HTTP
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Debug (désactiver en prod)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// OPTIONS CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../Middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../../config.php'; // Connexion PDO

// Vérification JWT + rôle
$user = AuthMiddleware::verifyRole(['admin', 'comptable', 'commercial', 'préparateur de commande', 'livreur', 'responsable de stock']);
$role = $user->role;

// Autorisations par rôle
$autorisations = [
    'admin' => ['GET', 'POST', 'PUT', 'DELETE'],
    'comptable' => ['GET', 'POST', 'PUT', 'DELETE'],
    'commercial' => ['GET'],
    'préparateur de commande' => ['GET'],
    'livreur' => ['GET'],
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
                $stmt = $pdo->prepare("
                    SELECT f.*, c.nom AS client_nom, c.email AS client_email 
                    FROM facture f
                    LEFT JOIN client c ON f.idclient = c.idclient
                    WHERE f.idfacture = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } elseif (isset($_GET['idclient'])) {
                $stmt = $pdo->prepare("SELECT * FROM facture WHERE idclient = ?");
                $stmt->execute([$_GET['idclient']]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $stmt = $pdo->query("
                    SELECT f.*, c.nom AS client_nom 
                    FROM facture f
                    LEFT JOIN client c ON f.idclient = c.idclient
                    ORDER BY f.date_facture DESC
                ");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['idclient'])) {
                http_response_code(400);
                echo json_encode(['error' => 'idclient requis']);
                exit;
            }
            $stmt = $pdo->prepare("INSERT INTO facture (idclient, date_facture, total, statut_facture) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['idclient'],
                $data['date_facture'] ?? date('Y-m-d'),
                $data['total'] ?? 0,
                $data['statut_facture'] ?? 'En attente'
            ]);
            echo json_encode(['success' => true, 'idfacture' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID facture requis']);
                exit;
            }
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE facture SET idclient=?, date_facture=?, total=?, statut_facture=? WHERE idfacture=?");
            $stmt->execute([
                $data['idclient'],
                $data['date_facture'] ?? date('Y-m-d'),
                $data['total'],
                $data['statut_facture'],
                $_GET['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID facture requis']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM facture WHERE idfacture=?");
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
