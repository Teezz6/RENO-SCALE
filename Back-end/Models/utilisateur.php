<?php
class Utilisateur {
    private $conn;
    private $table = "Utilisateur";

    public $nom;
    public $prenom;
    public $email;
    public $mot_passe;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function register() {
        $query = "INSERT INTO " . $this->table . "
                  (nom, prenom, email, mot_passe, role)
                  VALUES (:nom, :prenom, :email, :mot_passe, :role)";

        $stmt = $this->conn->prepare($query);

        // Protection contre les injections
        $stmt->bindParam(':nom', $this->nom);
        $stmt->bindParam(':prenom', $this->prenom);
        $stmt->bindParam(':email', $this->email);
        $hashed_password = password_hash($this->mot_passe, PASSWORD_DEFAULT);
        $stmt->bindParam(':mot_passe', $hashed_password);
        $stmt->bindParam(':role', $this->role);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>
