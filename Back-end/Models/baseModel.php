<?php
require_once __DIR__ . '/../config/database.php';

class BaseModel {
    protected $pdo;
    protected $table;

    // Le constructeur reçoit le nom de la table à manipuler
    public function __construct($table) {
        $this->pdo = Database::connect();  // Connexion à la BDD
        $this->table = $table;             // Exemple : "produits", "clients"
    }

    // Récupérer tous les enregistrements
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Récupérer un enregistrement par son id
    public function getById($id, $idField = 'id') {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE $idField = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Créer un nouvel enregistrement
    public function create($fields) {
        $columns = implode(', ', array_keys($fields));                       // ex: nom, email
        $placeholders = implode(', ', array_fill(0, count($fields), '?'));  // ex: ?, ?
        $stmt = $this->pdo->prepare("INSERT INTO {$this->table} ($columns) VALUES ($placeholders)");
        return $stmt->execute(array_values($fields));
    }

    // Mettre à jour un enregistrement
    public function update($id, $fields, $idField = 'id') {
        $setClause = implode(', ', array_map(fn($key) => "$key = ?", array_keys($fields))); // ex: nom = ?, email = ?
        $stmt = $this->pdo->prepare("UPDATE {$this->table} SET $setClause WHERE $idField = ?");
        return $stmt->execute([...array_values($fields), $id]);
    }

    // Supprimer un enregistrement
    public function delete($id, $idField = 'id') {
        $stmt = $this->pdo->prepare("DELETE FROM {$this->table} WHERE $idField = ?");
        return $stmt->execute([$id]);
    }
}
