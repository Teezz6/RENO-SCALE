<?php
// helpers/MailHelper.php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';  // adapte le chemin si besoin

function sendWelcomeEmail($toEmail, $resetToken) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = '192.168.1.50';
        $mail->SMTPAuth = true;
        $mail->Username = 'admin@fashionchic.local';
        $mail->Password = 'debian';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('noreply@fashionchic.local', 'FashionChic Admin');
        $mail->addAddress($toEmail);

        $mail->isHTML(true);
        $mail->Subject = 'Bienvenue chez FashionChic - Activation de votre compte';

        $resetUrl = "http://localhost/Dev_project/RENO-SCALE-1/Back-end/Routes/API/reset-password.php" . urlencode($resetToken);

        $mail->Body = "
            <p>Bonjour,</p>
            <p>Votre compte a été créé par l'administrateur.</p>
            <p>Votre identifiant : <b>{$toEmail}</b></p>
            <p>Pour définir votre mot de passe, veuillez cliquer sur ce lien :</p>
            <p><a href='{$resetUrl}'>Réinitialiser votre mot de passe</a></p>
            <p>Ce lien est valable 1 heure.</p>
            <p>Bonne journée,<br>L'équipe FashionChic</p>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Erreur lors de l'envoi du mail : {$mail->ErrorInfo}");
        return false;
    }
}
