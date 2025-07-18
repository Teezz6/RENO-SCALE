<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../Config/database.php';
require_once __DIR__ . '/../../Helpers/JWT.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Connexion à la base de données
    $database = new Database();
    $pdo = $database->getConnection();

    // Récupération des données JSON
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $mot_passe = $data['mot_passe'] ?? '';

    // Vérification des champs
    if (empty($email) || empty($mot_passe)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email et mot de passe requis']);
        exit;
    }

    // Préparation de la requête
    $stmt = $pdo->prepare("SELECT idutilisateur, nom, prenom, email, mot_passe, role FROM Utilisateur WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($mot_passe, $user['mot_passe'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Email ou mot de passe incorrect']);
        exit;
    }

    // Génération du token
    $token = JWTHandler::generateToken([
        'id' => $user['idutilisateur'],
        'email' => $user['email'],
        'role' => $user['role'],
        'nom' => $user['nom'],
        'prenom' => $user['prenom']
    ]);

    // Réponse
    echo json_encode([
        'status' => 'success',
        'token' => $token,
        'user' => [
            'id' => $user['idutilisateur'],
            'nom' => $user['nom'],
            'prenom' => $user['prenom'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur serveur : ' . $e->getMessage()
    ]);
}
