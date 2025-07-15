<?php

class SageInvoiceController
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Calcul du prix unitaire d’un lot (basé sur les produits qu’il contient)
    private function getLotPrixUnitaire($lotCode){

       $stmt = $this->pdo->prepare("
         SELECT SUM(p.prix_unitaire * lp.quantite_lot) AS prix_total
         FROM Lot_Produit lp
         JOIN Produit p ON lp.idproduit = p.idproduit
         WHERE lp.idlot = ?
        ");
       $stmt->execute([$lotCode]);
       $result = $stmt->fetch(PDO::FETCH_ASSOC);

       if (!$result || $result['prix_total'] === null) {
         throw new Exception("Lot '$lotCode' introuvable ou mal défini.");
       }

       return $result['prix_total'];
    }


    // Créer une facture
    public function createInvoice($data)
    {
        try {
            $this->pdo->beginTransaction();

            // Valeurs par défaut
            $statut = $data['statut_facture'] ?? 'En attente';

            // 1. Création de la facture
            $stmt = $this->pdo->prepare("INSERT INTO Facture (idclient, date_facture, total, statut_facture) VALUES (?, ?, ?, ?)");
            $stmt->execute([$data['idclient'], $data['date_facture'], 0, $statut]);
            $invoiceId = $this->pdo->lastInsertId();

            $total = 0;

            // 2. Insertion des lots dans la facture
            foreach ($data['items'] as $item) {
                $prix_unit = $this->getLotPrixUnitaire($item['lot']);
                $stmtItem = $this->pdo->prepare("INSERT INTO Facture_item (idfacture, lot, quantite, prix_unit) VALUES (?, ?, ?, ?)");
                $stmtItem->execute([$invoiceId, $item['lot'], $item['quantite'], $prix_unit]);
                $total += $item['quantite'] * $prix_unit;
            }

            // 3. Mise à jour du total
            $stmtUpdate = $this->pdo->prepare("UPDATE Facture SET total = ? WHERE idfacture = ?");
            $stmtUpdate->execute([$total, $invoiceId]);

            $this->pdo->commit();

            return [
                "status" => "success",
                "invoice_id" => $invoiceId,
                "total" => $total
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    //  Récupérer une facture
    public function getInvoice($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM Facture WHERE idfacture = ?");
        $stmt->execute([$id]);
        $invoice = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$invoice) return null;

        $stmtItems = $this->pdo->prepare("SELECT lot, quantite, prix_unit FROM Facture_item WHERE idfacture = ?");
        $stmtItems->execute([$id]);
        $invoice['items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        return $invoice;
    }

    // Lister toutes les factures
    public function listInvoices()
    {
        $stmt = $this->pdo->query("SELECT * FROM Facture");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Modifier une facture
    public function updateInvoice($id, $data)
    {
        try {
            $this->pdo->beginTransaction();

            // Mettre à jour la facture
            $stmt = $this->pdo->prepare("UPDATE Facture SET idclient = ?, date_facture = ?, statut_facture = ? WHERE idfacture = ?");
            $stmt->execute([$data['idclient'], $data['date_facture'], $data['statut_facture'] ?? 'En attente', $id]);

            // Supprimer les anciens items
            $this->pdo->prepare("DELETE FROM Facture_item WHERE idfacture = ?")->execute([$id]);

            // Réinsérer les nouveaux items
            $total = 0;
            foreach ($data['items'] as $item) {
                $prix_unit = $this->getLotPrixUnitaire($item['lot']);
                $stmtItem = $this->pdo->prepare("INSERT INTO Facture_item (idfacture, lot, quantite, prix_unit) VALUES (?, ?, ?, ?)");
                $stmtItem->execute([$id, $item['lot'], $item['quantite'], $prix_unit]);
                $total += $item['quantite'] * $prix_unit;
            }

            // Mettre à jour le total
            $this->pdo->prepare("UPDATE Facture SET total = ? WHERE idfacture = ?")->execute([$total, $id]);

            $this->pdo->commit();

            return [
                "status" => "success",
                "message" => "Facture mise à jour avec succès.",
                "total" => $total
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }

    // Supprimer une facture
    public function deleteInvoice($id)
    {
        try {
            $this->pdo->beginTransaction();

            $this->pdo->prepare("DELETE FROM Facture_item WHERE idfacture = ?")->execute([$id]);
            $this->pdo->prepare("DELETE FROM Facture WHERE idfacture = ?")->execute([$id]);

            $this->pdo->commit();

            return [
                "status" => "success",
                "message" => "Facture supprimée avec succès."
            ];
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return [
                "status" => "error",
                "message" => $e->getMessage()
            ];
        }
    }
}
