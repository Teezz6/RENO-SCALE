<?php
require_once 'baseModel.php';

class FactureModel extends BaseModel {
    protected $table = 'Facture';
    protected $primaryKey = 'idfacture';

    public function __construct() {
        parent::__construct($this->table);
    }

    // Récupère les infos de facture avec le client
    public function getFactureAvecClient($idfacture) {
        $sql = "SELECT 
                    f.idfacture,
                    f.date_facture,
                    f.total,
                    f.statut_facture,
                    c.idclient,
                    c.nom AS nom_client,
                    c.prenom AS prenom_client
                FROM Facture f
                JOIN Client c ON f.idclient = c.idclient
                WHERE f.idfacture = :idfacture";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':idfacture', $idfacture, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
