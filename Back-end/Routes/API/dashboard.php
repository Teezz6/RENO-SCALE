<?php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (!isset($_SESSION['utilisateur'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Utilisateur non connecté'
    ]);
    exit;
}

$utilisateur = $_SESSION['utilisateur'];
$role = $utilisateur['role'];

$data = [];

switch ($role) {
    case 'comptable':
        $data = [
            'titre' => 'Tableau de bord Comptable',
            'stats' => ['revenus' => 15000, 'dépenses' => 9000]
        ];
        break;
    case 'livreur':
        $data = [
            'titre' => 'Tableau de bord Livreur',
            'tournées_du_jour' => 12,
            'commandes_restantes' => 4
        ];
        break;
    case 'préparateur':
        $data = [
            'titre' => 'Tableau de bord Préparateur',
            'commandes_en_attente' => 7
        ];
        break;
    default:
        $data = ['titre' => 'Dashboard générique'];
}

echo json_encode([
    'status' => 'success',
    'role' => $role,
    'nom' => $utilisateur['nom'],
    'prenom' => $utilisateur['prenom'],
    'email' => $utilisateur['email'],
    'dashboard' => $data
]);
