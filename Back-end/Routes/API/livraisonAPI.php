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
$user = AuthMiddleware::verifyRole(['admin', 'livreur', 'commercial', 'préparateur de commande', 'comptable', 'responsable de stock']);
$role = $user->role;

// Autorisations par rôle
$autorisations = [
    'admin' => ['GET', 'POST', 'PUT', 'DELETE'],
    'livreur' => ['GET', 'POST', 'PUT', 'DELETE'],
    'commercial' => ['GET'],
    'préparateur de commande' => ['GET'],
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
                $stmt = $pdo->prepare("
                    SELECT l.*, c.statut AS commande_statut 
                    FROM livraison l
                    LEFT JOIN commande c ON l.idcommande = c.idcommande
                    WHERE l.idlivraison = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } elseif (isset($_GET['idcommande'])) {
                $stmt = $pdo->prepare("
                    SELECT l.* FROM livraison l
                    WHERE l.idcommande = ?");
                $stmt->execute([$_GET['idcommande']]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                $stmt = $pdo->query("
                    SELECT l.*, c.statut AS commande_statut 
                    FROM livraison l
                    LEFT JOIN commande c ON l.idcommande = c.idcommande
                    ORDER BY l.date_livraison DESC
                ");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['idcommande']) || empty($data['statut_livraison'])) {
                http_response_code(400);
                echo json_encode(['error' => 'idcommande et statut_livraison requis']);
                exit;
            }
            $stmt = $pdo->prepare("INSERT INTO livraison (date_livraison, statut_livraison, idcommande) VALUES (?, ?, ?)");
            $stmt->execute([
                $data['date_livraison'] ?? date('Y-m-d'),
                $data['statut_livraison'],
                $data['idcommande']
            ]);
            echo json_encode(['success' => true, 'idlivraison' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID livraison requis']);
                exit;
            }
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE livraison SET date_livraison=?, statut_livraison=?, idcommande=? WHERE idlivraison=?");
            $stmt->execute([
                $data['date_livraison'] ?? date('Y-m-d'),
                $data['statut_livraison'],
                $data['idcommande'],
                $_GET['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID livraison requis']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM livraison WHERE idlivraison=?");
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
