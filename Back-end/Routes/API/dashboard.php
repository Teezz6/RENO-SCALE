<?php
require_once __DIR__ . '/../../Middlewares/AuthMiddleware.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://web');
header('Access-Control-Allow-Headers: Authorization');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');

$decoded = AuthMiddleware::verify();

$role = $decoded->role ?? null;
$utilisateur = $decoded->user ?? null;


$redirect = '../pages/pageaccueil.html'; // défaut

// Définir les redirections selon le rôle
if ($role === 'admin') {
    $redirect = '../../../Front-end/pages/pageadmin.html';
} elseif (in_array($role, ['préparateur de commande', 'livreur', 'commercial'])) {
    $redirect = '../../../Front-end/pages/pagecommande.html';
} elseif (in_array($role, ['commercial', 'responsable de stock'])) {
    $redirect = '../../../Front-end/pages/pagestock.html';
} elseif ($role === 'comptable') {
    $redirect = '../../../Front-end/pages/pagecomptabilite.html';
} else {
    $redirect = '../../../Front-end/pages/pageaccueil.html';
}

echo json_encode([
    'status' => 'success',
    'role' => $role,
    'redirect' => $redirect,
    'nom' => $utilisateur['nom'] ?? '',
    'prenom' => $utilisateur['prenom'] ?? '',
    'email' => $utilisateur['email'] ?? ''
]);
