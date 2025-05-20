<?php
require_once 'config/database.php';

$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    echo "Connexion réussie à la base de données ✅";
} else {
    echo "Échec de la connexion ❌";
}
?>
