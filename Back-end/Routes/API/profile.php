<?php
session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once __DIR__ . '/../../controllers/authController.php';

$auth = new AuthController();
$response = $auth->getProfile();

echo json_encode($response);
