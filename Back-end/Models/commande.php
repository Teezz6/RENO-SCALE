<?php
// Models/commande.php
require_once 'baseModel.php';

class OrderModel extends BaseModel {
    protected $table = 'Commande';
    protected $primaryKey = 'idcommande';

    public function __construct() {
        parent::__construct($this->table);
    }

    public function createCommande($contenu, $date_envoi, $statut, $idclient, $reffacturesage = null) {
        $sql = "INSERT INTO Commande (contenu, date_envoi, statut, idclient, reffacturesage)
                VALUES (:contenu, :date_envoi, :statut, :idclient, :reffacturesage)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'contenu' => $contenu,
            'date_envoi' => $date_envoi,
            'statut' => $statut,
            'idclient' => $idclient,
            'reffacturesage' => $reffacturesage
        ]);

        return $this->pdo->lastInsertId();
    }

    public function getAllCommandes() {
       $sql = "SELECT 
                c.idcommande, 
                c.contenu,
                c.date_envoi,
                c.statut,
                cl.nom AS client_nom
            FROM Commande c
            JOIN Client cl ON c.idclient = cl.idclient
            ORDER BY c.idcommande DESC";
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function ajouterLotCommande($idcommande, $idlot, $quantite) {
        $sql = "INSERT INTO Commande_Lot (idcommande, idlot, quantite_commande)
                VALUES (:idcommande, :idlot, :quantite)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            'idcommande' => $idcommande,
            'idlot' => $idlot,
            'quantite' => $quantite
        ]);
    }

    public function createWithLots($data) {
      try {
         $this->pdo->beginTransaction();

         // 1. Créer la commande
         $sql = "INSERT INTO Commande (contenu, date_envoi, statut, idclient)
                VALUES (:contenu, :date_envoi, :statut, :idclient)";
         $stmt = $this->pdo->prepare($sql);
         $stmt->execute([
             'contenu' => $data['contenu'] ?? '',
             'date_envoi' => date('Y-m-d'),
             'statut' => $data['statut'] ?? 'En attente',
             'idclient' => $data['idclient'],
            
            ]);

         $idcommande = $this->pdo->lastInsertId();

         // 2. Ajouter les lots associés
         $sqlLot = "INSERT INTO Commande_Lot (idcommande, idlot, quantite_commande)
                   VALUES (:idcommande, :idlot, :quantite)";
         $stmtLot = $this->pdo->prepare($sqlLot);

         foreach ($data['lots'] as $lot) {
             $stmtLot->execute([
                 'idcommande' => $idcommande,
                 'idlot' => $lot['idlot'],
                 'quantite' => $lot['quantite']
               ]);
           }

          $this->pdo->commit();

          return [
             'success' => true,
             'message' => 'Commande créée avec lots.',
             'idcommande' => $idcommande
           ];

        } catch (Exception $e) {
         $this->pdo->rollBack();
         return [
             'success' => false,
             'error' => 'Erreur lors de la création : ' . $e->getMessage()
           ];
        }
    }


}

?>
