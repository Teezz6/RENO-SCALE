<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");


require_once(__DIR__ . '/../../Helpers/JWT.php');
require_once __DIR__ . '/../../Config/database.php';
require_once __DIR__ . '/../../Models/utilisateur.php';



// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $token = $input['token'] ?? '';
    $password = $input['password'] ?? '';
    $confirmPassword = $input['confirmPassword'] ?? '';

    if (empty($token) || empty($password) || empty($confirmPassword)) {
        echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis.']);
        exit;
    }

    if ($password !== $confirmPassword) {
        echo json_encode(['status' => 'error', 'message' => 'Les mots de passe ne correspondent pas.']);
        exit;
    }

    $decoded = JWTHandler::verifyToken($token);
    if (!$decoded) {
        echo json_encode(['status' => 'error', 'message' => 'Token invalide ou expiré.']);
        exit;
    }

    // Mise à jour du mot de passe
    $db = new Database();
    $conn = $db->getConnection();
    $utilisateur = new Utilisateur($conn);
    $utilisateur->email = $decoded->email;
    $utilisateur->mot_passe = $password;

    if ($utilisateur->updatePassword()) {
        echo json_encode(['status' => 'success', 'message' => 'Mot de passe mis à jour avec succès.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour du mot de passe.']);
    }
    exit;
}
?>
