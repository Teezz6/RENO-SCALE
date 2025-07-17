<?php
require_once 'baseModel.php';

class LotModel extends BaseModel {
    protected $table = 'Lot';   // attention à la casse : généralement en minuscules
    protected $primaryKey = 'idlot';

    public function __construct() {
        parent::__construct($this->table);
    }

    public function createWithProduits($data) {
        try {
            $this->pdo->beginTransaction();

            // Enlever 'produits' de $data
            $lotData = $data;
            unset($lotData['produits']);

            // Insert dans la table 'lot'
            $columns = implode(', ', array_keys($lotData));
            $placeholders = ':' . implode(', :', array_keys($lotData));
            $sql = "INSERT INTO {$this->table} ($columns) VALUES ($placeholders)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($lotData);

            // Récupérer l'id du lot inséré
            $idLot = $this->pdo->lastInsertId();

            // Préparer insertion dans lot_produit
            $sqlProduit = "INSERT INTO lot_produit (idlot, idproduit, quantite_lot) VALUES (:idlot, :idproduit, :quantite)";
            $stmtProduit = $this->pdo->prepare($sqlProduit);

            // Parcourir les produits
            foreach ($data['produits'] as $produit) {
                $stmtProduit->execute([
                    ':idlot' => $idLot,
                    ':idproduit' => $produit['idproduit'],
                    ':quantite' => $produit['quantite_lot'],
                ]);
            }

            $this->pdo->commit();
            return $idLot;

        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;  // ou retourner false, ou gérer l'erreur
        }
    }
}
?>
