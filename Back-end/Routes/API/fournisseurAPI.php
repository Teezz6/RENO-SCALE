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

$user = AuthMiddleware::verifyRole(['admin', 'commercial', 'responsable de stock', 'livreur', 'comptable']);
$role = $user->role;

$autorisations = [
    'admin' => ['GET', 'POST', 'PUT', 'DELETE'],
    'commercial' => ['GET'],
    'responsable de stock' => ['GET'],
    'livreur' => ['GET'],
    'comptable' => ['GET']
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
                $stmt = $pdo->prepare("SELECT * FROM fournisseur WHERE idfournisseur=?");
                $stmt->execute([$_GET['id']]);
                echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
            } else {
                $stmt = $pdo->query("SELECT * FROM fournisseur ORDER BY nom ASC");
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            if ($role !== 'admin') {
                http_response_code(403);
                echo json_encode(['error' => 'Seul l’admin peut créer un fournisseur']);
                exit;
            }
            if (empty($data['nom'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Nom requis']);
                exit;
            }
            $stmt = $pdo->prepare("INSERT INTO fournisseur (nom, contact, origine_produit, email, telephone) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['nom'],
                $data['contact'] ?? null,
                $data['origine_produit'] ?? null,
                $data['email'] ?? null,
                $data['telephone'] ?? null
            ]);
            echo json_encode(['success' => true, 'idfournisseur' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
            if ($role !== 'admin') {
                http_response_code(403);
                echo json_encode(['error' => 'Seul l’admin peut modifier un fournisseur']);
                exit;
            }
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID fournisseur requis']);
                exit;
            }
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE fournisseur SET nom=?, contact=?, origine_produit=?, email=?, telephone=? WHERE idfournisseur=?");
            $stmt->execute([
                $data['nom'],
                $data['contact'] ?? null,
                $data['origine_produit'] ?? null,
                $data['email'] ?? null,
                $data['telephone'] ?? null,
                $_GET['id']
            ]);
            echo json_encode(['success' => true]);
            break;

        case 'DELETE':
            if ($role !== 'admin') {
                http_response_code(403);
                echo json_encode(['error' => 'Seul l’admin peut supprimer un fournisseur']);
                exit;
            }
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID fournisseur requis']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM fournisseur WHERE idfournisseur=?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(['success' => true]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur : ' . $e->getMessage()]);
}
