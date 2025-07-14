<?php
require_once '../../Models/lot_produit.php';

if (isset($_GET['idlot'])) {
    $model = new LotProduitModel();
    $result = $model->getProduitsByLot($_GET['idlot']);
    header('Content-Type: application/json');
    echo json_encode($result);
} else {
    echo json_encode(['error' => 'ID Lot manquant']);
}
?>
