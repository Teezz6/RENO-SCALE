<?php
require_once 'baseModel.php';

class FactureItemModel extends BaseModel {
    protected $table = 'Facture_item';
    protected $primaryKey = 'idfacture_items';

    public function __construct() {
        parent::__construct($this->table);
    }

    // Récupère les items d'une facture avec le détail du lot
    public function getItemsParFacture($idfacture) {
        $sql = "SELECT 
                    fi.idfacture_items,
                    fi.lot,
                    fi.quantite,
                    fi.prix_unit,
                    l.idlot,
                    l.nom_lot
                FROM Facture_item fi
                JOIN Lot l ON fi.idlot = l.idlot
                WHERE fi.id_facture = :idfacture";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':idfacture', $idfacture, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
