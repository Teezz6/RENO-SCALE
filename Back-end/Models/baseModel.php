<?php
require_once __DIR__ . '/../Config/database.php'; // Inclusion du fichier Database

class BaseModel {
    protected $pdo;             // Connexion PDO à la base de données
    protected $table;           // Nom de la table à manipuler
    protected $primaryKey = 'id'; // Clé primaire (par défaut), peut être surchargée

    // Le constructeur reçoit le nom de la table concernée
    public function __construct($table) {
        $this->pdo = (new Database())->getConnection(); // Connexion à la BDD
        $this->table = $table;
    }

    // Méthode pour récupérer tous les enregistrements
    public function getAll() {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table}");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Méthode pour récupérer un enregistrement par son ID
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Méthode pour insérer un nouvel enregistrement
    public function create($data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        $sql = "INSERT INTO {$this->table} ($columns) VALUES ($placeholders)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($data);
    }

    // Méthode pour mettre à jour un enregistrement
    public function update($id, $data) {
        $fields = implode(', ', array_map(fn($col) => "$col = :$col", array_keys($data)));
        $sql = "UPDATE {$this->table} SET $fields WHERE {$this->primaryKey} = :primaryKey";
        $stmt = $this->pdo->prepare($sql);
        $data['primaryKey'] = $id;
        return $stmt->execute($data);
    }

    // Méthode pour supprimer un enregistrement
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM {$this->table} WHERE {$this->primaryKey} = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>
