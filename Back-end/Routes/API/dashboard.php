<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://web'); // Remplace par le domaine exact de ta page web
header('Access-Control-Allow-Credentials: true');

// Vérification de la connexion
if (!isset($_SESSION['utilisateur'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Utilisateur non connecté'
    ]);
    exit;
}

$utilisateur = $_SESSION['utilisateur'];
$role = $utilisateur['role'];

// Association des rôles aux pages correspondantes
$routes = [
    'admin' => '../../../Front-end/pages/pageadmin.html',
    'comptable' => '../pages/comptable.html',
    'livreur' => '../pages/livreur.html',
    'préparateur' => '../pages/preparateur.html',
    'commercial' => '../pages/commercial.html'
];

// Page par défaut si le rôle n'existe pas dans la liste
$page = isset($routes[$role]) ? $routes[$role] : '../pages/pageaccueil.html';

// Réponse JSON
echo json_encode([
    'status' => 'success',
    'role' => $role,
    'redirect' => $page,
    'nom' => $utilisateur['nom'],
    'prenom' => $utilisateur['prenom'],
    'email' => $utilisateur['email']
]);
