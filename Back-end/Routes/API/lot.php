<?php
require_once '../../Models/lot_produit.php';

header('Content-Type: application/json');
// Autoriser les requêtes cross-origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");


if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['idlot'])) {
    $idlot = (int)$_GET['idlot'];
    $model = new LotProduitModel();
    $produits = $model->getProduitsByLot($idlot);
    echo json_encode($produits);
} else {
    echo json_encode(['error' => 'Paramètre idlot manquant ou méthode non supportée']);
}

