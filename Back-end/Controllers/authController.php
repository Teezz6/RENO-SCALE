<?php
header("Content-Type: application/json");
require_once '../Config/database.php';
require_once '../Models/utilisateur.php';

// Connexion DB
$db = new Database();
$conn = $db->getConnection();

// Récupération des données JSON
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->nom) &&
    !empty($data->prenom) &&
    !empty($data->email) &&
    !empty($data->mot_passe) &&
    !empty($data->role)
) {
    $utilisateur = new Utilisateur($conn);
    $utilisateur->nom = htmlspecialchars(strip_tags($data->nom));
    $utilisateur->prenom = htmlspecialchars(strip_tags($data->prenom));
    $utilisateur->email = htmlspecialchars(strip_tags($data->email));
    $utilisateur->mot_passe = $data->mot_passe;
    $utilisateur->role = $data->role;

    if ($utilisateur->register()) {
        http_response_code(201);
        echo json_encode(["message" => "Utilisateur enregistré avec succès"]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Échec de l'enregistrement"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Champs manquants"]);

    // LOGIN
if (
    isset($data->email) &&
    isset($data->mot_passe) &&
    empty($data->nom) // Cela permet de distinguer connexion et inscription
) {
    $utilisateur = new Utilisateur($conn);
    $utilisateur->email = htmlspecialchars(strip_tags($data->email));
    $utilisateur->mot_passe = $data->mot_passe;

    $loggedUser = $utilisateur->login();

    if ($loggedUser) {
        http_response_code(200);
        echo json_encode([
            "message" => "Connexion réussie ",
            "utilisateur" => $loggedUser
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Email ou mot de passe incorrect "]);
    }
}

}
?>
