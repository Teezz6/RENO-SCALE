<?php
// En-têtes HTTP pour le CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


// Gestion préliminaire des erreurs
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Interception requêtes OPTIONS (pré-flight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../Middleware/AuthMiddleware.php';

// Vérification de l’authentification (présence d’un token JWT)
$user = AuthMiddleware::verify();

// Récupère la méthode HTTP et l'entité
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_GET['url'] ?? '', '/'));
$entity = $request[0] ?? null;
$id = $request[1] ?? null;

// Règles d'accès par rôle et entité
$role = $user->role;

// Politique d'accès
switch ($role) {
    case 'admin':
        // Admin a accès total à tout
        break;

    case 'responsable_stock':
        $autorisations = [
            'Produit' => ['GET', 'POST', 'PUT', 'DELETE'],
            'Lot'     => ['GET'],
        ];
        if (!isset($autorisations[$entity]) || !in_array($method, $autorisations[$entity])) {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé pour le responsable de stock sur cette entité ou action.']);
            exit;
        }
        break;

    case 'commercial':
        $autorisations = [
            'Produit'       => ['GET'],
            'Lot'           => ['GET', 'POST', 'PUT', 'DELETE'],
            'Lot_Produit'           => ['GET', 'POST', 'PUT', 'DELETE'],
            'Commande'      => ['GET'],
            'Client'        => ['GET', 'POST', 'PUT', 'DELETE'],
            'Fournisseur'   => ['GET'], // lecture seulement
            'Livraison'     => ['GET'], // lecture seulement
        ];
        if (!isset($autorisations[$entity]) || !in_array($method, $autorisations[$entity])) {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé pour le commercial sur cette entité ou action.']);
            exit;
        }
        break;

    case 'preparateur':
        $autorisations = [
            'Commande' => ['GET', 'POST', 'PUT', 'DELETE'],
            'Commande_Lot' => ['GET', 'POST', 'PUT', 'DELETE'],
        ];
        if (!isset($autorisations[$entity]) || !in_array($method, $autorisations[$entity])) {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé pour le préparateur sur cette entité ou action.']);
            exit;
        }
        break;

    case 'livreur':
        $autorisations = [
            'Livraison' => ['GET', 'POST', 'PUT', 'DELETE'],
        ];
        if (!isset($autorisations[$entity]) || !in_array($method, $autorisations[$entity])) {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé pour le livreur sur cette entité ou action.']);
            exit;
        }
        break;

    case 'comptable':
        $autorisations = [
            'Facture' => ['GET', 'POST', 'PUT', 'DELETE'],
            'Facture_item' => ['GET', 'POST', 'PUT', 'DELETE'],
        ];
        if (!isset($autorisations[$entity]) || !in_array($method, $autorisations[$entity])) {
            http_response_code(403);
            echo json_encode(['error' => 'Accès refusé pour le comptable sur cette entité ou action.']);
            exit;
        }
        break;

    default:
        http_response_code(403);
        echo json_encode(['error' => "Rôle utilisateur inconnu ou non autorisé : $role"]);
        exit;
}



// Inclusion du contrôleur générique
require_once __DIR__ . '/../../Controllers/baseController.php';

// Mapping des entités vers fichiers/classes
$modelsMap = [
    'Utilisateur'     => ['file' => 'utilisateur.php', 'class' => 'UtilisateurModel'],
    'Produit'     => ['file' => 'produit.php', 'class' => 'ProduitModel'],
    'Client'      => ['file' => 'client.php', 'class' => 'ClientModel'],
    'Commande'    => ['file' => 'commande.php', 'class' => 'OrderModel'],
    'Fournisseur' => ['file' => 'fournisseur.php', 'class' => 'SupplierModel'],
    'Livraison'   => ['file' => 'livraison.php', 'class' => 'DeliveryModel'],
    'Lot'         => ['file' => 'lot.php', 'class' => 'LotModel'],
    'Lot_Produit' => ['file' => 'lot_produit.php', 'class' => 'LotProduitModel'],
    'Commande_Lot' => ['file' => 'commande_lot.php', 'class' => 'CommandeLotModel'],
    'Facture'    => ['file' => 'facture.php', 'class' => 'FactureModel'],
    'Facture_item'    => ['file' => 'facture_item.php', 'class' => 'FactureItemModel'],
];


// Vérification de l'entité demandée
if (!isset($modelsMap[$entity])) {
    http_response_code(404);
    echo json_encode(['error' => "Entité inconnue : $entity"]);
    exit;
}

$modelPath = __DIR__ . "/../../Models/" . $modelsMap[$entity]['file'];
$modelClass = $modelsMap[$entity]['class'];

// Vérifie que le fichier existe
if (!file_exists($modelPath)) {
    http_response_code(500);
    echo json_encode(['error' => "Fichier modèle introuvable : {$modelsMap[$entity]['file']}"]);
    exit;
}

// Inclusion du fichier modèle
require_once $modelPath;

// Vérifie que la classe existe
if (!class_exists($modelClass)) {
    http_response_code(500);
    echo json_encode(['error' => "Classe modèle introuvable : $modelClass"]);
    exit;
}

// Création du contrôleur
$controller = new BaseController($modelClass);

// Récupère la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Exécute l'action en fonction de la méthode
switch ($method) {
    case 'GET':
        $response = $id ? $controller->getById($id) : $controller->getAll();
        echo json_encode($response);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->create($data));
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->update($id, $data));
        break;

    case 'DELETE':
        echo json_encode($controller->delete($id));
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode HTTP non autorisée']);
        break;
}
