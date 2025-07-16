<?php
require_once __DIR__ . '/../Helpers/JWT.php';

class AuthMiddleware
{
    // Vérifie simplement que le token JWT est valide
    public static function verify()
    {
        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Token manquant']);
            exit;
        }

        $authHeader = $headers['Authorization'];
        if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Format du token invalide']);
            exit;
        }

        $token = $matches[1];
        $decoded = JWTHandler::verifyToken($token);

        if (!$decoded) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Token invalide ou expiré']);
            exit;
        }

        // Tu peux accéder aux infos utilisateur : $decoded->id, $decoded->role, etc.
        return $decoded;
    }

    // Vérifie que le rôle de l’utilisateur est dans la liste autorisée
    public static function verifyRole(array $rolesAutorises)
    {
        $decoded = self::verify();

        if (!in_array($decoded->role, $rolesAutorises)) {
            http_response_code(403);
            echo json_encode([
                'status' => 'error',
                'message' => 'Accès refusé. Rôle requis : ' . implode(', ', $rolesAutorises)
            ]);
            exit;
        }

        return $decoded;
    }
}
?>
