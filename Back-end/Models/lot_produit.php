<?php
require_once 'baseModel.php';

class LotProduitModel extends BaseModel {
    protected $table = 'Lot_Produit';
    protected $primaryKey = 'id_lot_produit'; // à adapter si ta clé primaire a un autre nom

    public function __construct() {
        parent::__construct($this->table);
    }

    //Jointures de produit et lot pour obtenir le lot, ses produits associés  et les informations de chaque produit.

    public function getProduitsByLot($idLot) {
       $sql = "SELECT 
                l.idlot,
                l.nom_lot,
                l.description,
                lp.quantite_lot,
                p.idproduit,
                p.nom,
                p.prix_unitaire
            FROM Lot l
            JOIN Lot_Produit lp ON l.idlot = lp.idlot
            JOIN Produit p ON lp.idproduit = p.idproduit
            WHERE l.idlot = :idlot";
    
       $stmt = $this->pdo->prepare($sql);
       $stmt->bindParam(':idlot', $idLot, PDO::PARAM_INT);
       $stmt->execute();
       return $stmt->fetchAll(PDO::FETCH_ASSOC);

       var_dump($res);
       exit;

       return $res;
    }

    public function getQuantiteTotaleParLot($idLot) {
        $sql = "SELECT SUM(lp.quantite_lot) AS quantiteTotale
            FROM Lot_Produit lp
            WHERE lp.idlot = :idlot";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':idlot', $idLot, PDO::PARAM_INT);
        $stmt->execute();
       return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
