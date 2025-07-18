<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require_once '../../Models/Commande.php';

$model = new OrderModel();
$commandes = $model->getAllCommandes();

header('Content-Type: application/json');
echo json_encode($commandes);
?>
