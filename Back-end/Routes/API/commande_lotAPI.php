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
$user = AuthMiddleware::verifyRole(['admin', 'commercial', 'préparateur de commande', 'livreur', 'comptable', 'responsable de stock']);
$role = $user->role;

// Autorisations par rôle
$autorisations = [
    'admin' => ['GET', 'POST', 'PUT', 'DELETE'],
    'commercial' => ['GET', 'POST', 'PUT', 'DELETE'],
    'préparateur de commande' => ['GET', 'POST', 'PUT', 'DELETE'],
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
                // Un lien commande-lot spécifique
                $stmt = $pdo->prepare("
                    SELECT cl.*, l.nom_lot, c.idcommande, c.statut 
                    FROM commande_lot cl
                    JOIN lot l ON cl.idlot = l.idlot
                    JOIN commande c ON cl.idcommande = c.idcommande
                    WHERE cl.id = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } elseif (isset($_GET['idcommande'])) {
                // Tous les lots d'une commande
                $stmt = $pdo->prepare("
                    SELECT cl.*, l.nom_lot, l.description 
                    FROM commande_lot cl
                    JOIN lot l ON cl.idlot = l.idlot
                    WHERE cl.idcommande = ?");
                $stmt->execute([$_GET['idcommande']]);
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else {
                // Tous les liens commande-lot
                $stmt = $pdo->query("
                    SELECT cl.*, l.nom_lot, c.idcommande, c.statut 
                    FROM commande_lot cl
                    JOIN lot l ON cl.idlot = l.idlot
                    JOIN commande c ON cl.idcommande = c.idcommande
                ");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['idcommande']) || empty($data['idlot']) || !isset($data['quantite_commande'])) {
                http_response_code(400);
                echo json_encode(['error' => 'idcommande, idlot et quantite_commande requis']);
                exit;
            }
            $stmt = $pdo->prepare("INSERT INTO commande_lot (idcommande, idlot, quantite_commande) VALUES (?, ?, ?)");
            $stmt->execute([$data['idcommande'], $data['idlot'], $data['quantite_commande']]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID requis']);
                exit;
            }
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE commande_lot 
                                   SET idcommande=?, idlot=?, quantite_commande=? 
                                   WHERE id=?");
            $stmt->execute([
                $data['idcommande'],
                $data['idlot'],
                $data['quantite_commande'],
                $_GET['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID requis']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM commande_lot WHERE id=?");
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
