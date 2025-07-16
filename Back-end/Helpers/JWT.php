<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/../../vendor/autoload.php';

class JWTHandler
{
    private static $secret = "em123!";  
    public static function generateToken($userData)
    {
        $payload = [
            'id' => $userData['id'],
            'email' => $userData['email'],
            'role' => $userData['role'],
            'exp' => time() + (60 * 60)  // Expire dans 1h
        ];

        return JWT::encode($payload, self::$secret, 'HS256');
    }

    public static function verifyToken($token)
    {
        try {
            return JWT::decode($token, new Key(self::$secret, 'HS256'));
        } catch (Exception $e) {
            return false;
        }
    }
}
?>
