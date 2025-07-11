<?php
require_once 'baseModel.php';

class CommandeLotModel extends BaseModel {
    protected $table = 'Commande_Lot';
    protected $primaryKey = 'id';

    public function __construct() {
        parent::__construct($this->table);
    }

    // Jointures de commandes et lot pour obtenir la commande, ses lots associés et les informations de chaque lot.

    public function getLotsByCommande($idCommande) {
    $sql = "SELECT 
                c.idcommande,
                c.contenu,
                c.date_envoi,
                cl.quantite_commande,
                l.idlot,
                l.nom_lot
            FROM Commande c
            JOIN Commande_Lot cl ON c.idcommande = cl.idcommande
            JOIN Lot l ON cl.idlot = l.idlot
            WHERE c.idcommande = :idcommande";
    
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindParam(':idcommande', $idCommande, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

}
?>
