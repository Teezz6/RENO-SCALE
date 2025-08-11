<?php
// En-têtes HTTP pour CORS et JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gestion des erreurs
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Interception requêtes OPTIONS (pré-flight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../Middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../../config.php'; // ton fichier de connexion PDO

// Vérification JWT et récupération utilisateur
$user = AuthMiddleware::verifyRole(['admin', 'commercial', 'responsable de stock']);
$role = $user->role;

// Vérification des permissions
$autorisations = [
    'admin' => ['GET', 'POST', 'PUT', 'DELETE'],
    'responsable de stock' => ['GET', 'POST', 'PUT', 'DELETE'],
    'commercial' => ['GET'] // lecture seule
];

$method = $_SERVER['REQUEST_METHOD'];
if (!isset($autorisations[$role]) || !in_array($method, $autorisations[$role])) {
    http_response_code(403);
    echo json_encode(['error' => "Accès refusé pour le rôle : $role"]);
    exit;
}

try {
    // CRUD PRODUIT
    switch ($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT * FROM produit WHERE idproduit = ?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                $stmt = $pdo->query("SELECT * FROM produit");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if (empty($data['reference']) || empty($data['nom'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Champs reference et nom requis']);
                exit;
            }
            $stmt = $pdo->prepare("INSERT INTO produit (reference, nom, taille, couleur, matiere, quantite_stock, prix_unitaire, idfournisseur) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['reference'],
                $data['nom'],
                $data['taille'] ?? null,
                $data['couleur'] ?? null,
                $data['matiere'] ?? null,
                $data['quantite_stock'] ?? 0,
                $data['prix_unitaire'] ?? null,
                $data['idfournisseur'] ?? null
            ]);
            echo json_encode(['success' => true, 'idproduit' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID produit requis']);
                exit;
            }
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE produit 
                                   SET reference=?, nom=?, taille=?, couleur=?, matiere=?, quantite_stock=?, prix_unitaire=?, idfournisseur=? 
                                   WHERE idproduit=?");
            $stmt->execute([
                $data['reference'],
                $data['nom'],
                $data['taille'] ?? null,
                $data['couleur'] ?? null,
                $data['matiere'] ?? null,
                $data['quantite_stock'] ?? 0,
                $data['prix_unitaire'] ?? null,
                $data['idfournisseur'] ?? null,
                $_GET['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID produit requis']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM produit WHERE idproduit=?");
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
