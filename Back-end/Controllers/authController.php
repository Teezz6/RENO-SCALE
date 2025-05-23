<?php
require_once __DIR__ .'/../Config/database.php';
require_once __DIR__ .'/../Models/utilisateur.php';

class AuthController {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    public function register($data) {
        if (
            !empty($data['nom']) &&
            !empty($data['prenom']) &&
            !empty($data['email']) &&
            !empty($data['mot_passe']) &&
            !empty($data['role'])
        ) {
            $utilisateur = new Utilisateur($this->conn);
            $utilisateur->nom = htmlspecialchars(strip_tags($data['nom']));
            $utilisateur->prenom = htmlspecialchars(strip_tags($data['prenom']));
            $utilisateur->email = htmlspecialchars(strip_tags($data['email']));
            $utilisateur->mot_passe = $data['mot_passe'];
            $utilisateur->role = $data['role'];

            if ($utilisateur->register()) {
                return ['status' => 'success'];
            } else {
                return ['status' => 'error', 'message' => "Échec de l'enregistrement"];
            }
        } else {
            return ['status' => 'error', 'message' => 'Champs manquants'];
        }
    }

    public function login($data) {
        if (!empty($data['email']) && !empty($data['mot_passe'])) {
            $utilisateur = new Utilisateur($this->conn);
            $utilisateur->email = htmlspecialchars(strip_tags($data['email']));
            $utilisateur->mot_passe = $data['mot_passe'];

            $loggedUser = $utilisateur->login();

            if ($loggedUser) {
                return ['status' => 'success', 'utilisateur' => $loggedUser];
            } else {
                return ['status' => 'error', 'message' => 'Email ou mot de passe incorrect'];
            }
        } else {
            return ['status' => 'error', 'message' => 'Champs manquants'];
        }
    }
}
?>
