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

// Définir les redirections selon les rôles
$redirect = '../pages/pageaccueil.html'; // par défaut

switch ($role) {
    case 'admin':
        $redirect = '../../../Front-end/pages/pageadmin.html';
        break;

    case 'comptable':
        $redirect = '../pages/comptable.html';
        break;

    case 'livreur':
        $redirect = '../pages/livreur.html';
        break;

    case 'préparateur':
    case 'livreur':
    case 'admin':
    case 'responsable de stock':
        $redirect = '../../../Front-end/pages/pagecommande.html';
        break;

    case 'commercial':
    case 'responsable de stock':
    case 'admin':
        $redirect = '../../../Front-end/pages/pagestock.html';
        break;

    default:
        $redirect = '../pages/pageaccueil.html';
        break;
}

// Réponse JSON
echo json_encode([
    'status' => 'success',
    'role' => $role,
    'redirect' => $redirect,
    'nom' => $utilisateur['nom'],
    'prenom' => $utilisateur['prenom'],
    'email' => $utilisateur['email']
]);
