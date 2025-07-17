<?php

require_once 'baseModel.php';

class UtilisateurModel extends BaseModel {
    protected $table = 'Utilisateur';
    protected $primaryKey = 'idutilisateur';

    public function __construct() {
        parent::__construct($this->table);
    }
}


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

    public function login() {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
         // Vérification du mot de passe
            if (password_verify($this->mot_passe, $row['mot_passe'])) {
               return [
                  "idutilisateur" => $row["idutilisateur"],
                   "nom" => $row["nom"],
                   "prenom" => $row["prenom"],
                   "email" => $row["email"],
                   "role" => $row["role"]
                ];
            }
        }
       return false;
    
    }   
    
    public function updatePassword() {
     $hashedPassword = password_hash($this->mot_passe, PASSWORD_BCRYPT);
     $stmt = $this->conn->prepare("UPDATE utilisateurs SET mot_passe = ? WHERE email = ?");
     return $stmt->execute([$hashedPassword, $this->email]);
    }

}
?>
