CREATE DATABASE fashionChic;
USE fashionChic;

CREATE TABLE Fournisseur (
    idfournisseur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(100),
    origine_produit VARCHAR(100),
    email VARCHAR(100),
    telephone VARCHAR(20)
);

CREATE TABLE Produit (
    idproduit INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    taille VARCHAR(10),
    couleur VARCHAR(30),
    matiere VARCHAR(50),
    quantite_stock INT DEFAULT 0,
    prix_unitaire DECIMAL(10,2),
    idfournisseur INT,
    FOREIGN KEY (idfournisseur) REFERENCES Fournisseur(idfournisseur)
);

CREATE TABLE Client (
    idclient INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    contact VARCHAR(100),
    email VARCHAR(100),
    telephone VARCHAR(20)
);

CREATE TABLE Commande (
    idcommande INT AUTO_INCREMENT PRIMARY KEY,
    date_envoi DATE NOT NULL,
    statut ENUM('En attente','Validé','Annulé'),
    idclient INT,
    reffacturesage VARCHAR(100),
    FOREIGN KEY (idclient) REFERENCES Client(idclient)
);

CREATE TABLE Commande_Produit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantite_commande INT NOT NULL,
    idcommande INT,
    idproduit INT,
    FOREIGN KEY (idcommande) REFERENCES Commande(idcommande),
    FOREIGN KEY (idproduit) REFERENCES Produit(idproduit)
);

CREATE TABLE Livraison (
    idlivraison INT AUTO_INCREMENT PRIMARY KEY,
    date_livraison DATE,
    statut_livraison ENUM('Expédié', 'Livré', 'Retardé'),
    idcommande INT,
    FOREIGN KEY (idcommande) REFERENCES Commande(idcommande)
);

CREATE TABLE Utilisateur (
    idutilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_passe VARCHAR(255) NOT NULL,
    role ENUM('admin', 'commercial', 'préparateur de commande', 'livreur', 'comptable', 'responsable de stock', 'support client') DEFAULT 'commercial'
);

