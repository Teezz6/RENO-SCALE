<?php

require_once __DIR__ . '/../../Controllers/sageinvoicesController.php';

// Connexion PDO (ajuste les infos de connexion selon ton environnement)
$pdo = new PDO("mysql:host=localhost;dbname=fashionchic;charset=utf8", "root", "", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$controller = new SageInvoiceController($pdo);

// Gérer les requêtes HTTP
header('Content-Type: application/json');

switch ($_SERVER['REQUEST_METHOD']) {

    case 'POST':
        // Création d’une facture
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Données JSON invalides']);
            exit;
        }

        $result = $controller->createInvoice($data);

        if ($result['status'] === 'success') {
            http_response_code(201);
        } else {
            http_response_code(500);
        }

        echo json_encode($result);
        break;

    case 'GET':
        // Récupérer toutes les factures (ou une facture si id passé en param)
        if (isset($_GET['id'])) {
            $invoice = $controller->getInvoice($_GET['id']);
            if ($invoice) {
                echo json_encode($invoice);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Facture non trouvée']);
            }
        } else {
            $invoices = $controller->listInvoices();
            echo json_encode($invoices);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
        break;
}
