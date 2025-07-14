<?php
require_once '../../Models/commande_lot.php';

if (isset($_GET['idcommande'])) {
    $model = new CommandeLotModel();
    $result = $model->getLotsByCommande($_GET['idcommande']);
    header('Content-Type: application/json');
    echo json_encode($result);
} else {
    echo json_encode(['error' => 'ID Commande manquant']);
}
?>
