document.addEventListener("DOMContentLoaded", function () {
    const apiBaseUrl = "http://localhost/Dev_project/RENO-SCALE-1/Back-end/Routes/API/entite.php?url=Produit"

    // Fonction pour récupérer et afficher les produits
    function fetchProduits() {
        fetch(apiBaseUrl)
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector("#produit-table tbody");
                tbody.innerHTML = "";
                data.forEach(produit => {
                    const tr = document.createElement("tr");
                    const lowStockClass = produit.quantite_stock <= 20 ? 'stock-faible' : '';
                    tr.innerHTML = `
                        <td>${produit.idproduit}</td>
                        <td>${produit.nom}</td>
                        <td>${produit.taille}</td>
                        <td>${produit.couleur}</td>
                        <td>${produit.matiere}</td>
                        <td class="${lowStockClass}">${produit.quantite_stock}</td>
                        <td>${produit.prix_unitaire} €</td>
                        <td>${produit.idfournisseur}</td>
                        <td>
                            <button onclick="modifierProduit(${produit.idproduit})">✏️</button>
                            <button onclick="supprimerProduit(${produit.idproduit})">🗑️</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error("Erreur de récupération :", error));
    }

    // Ajouter un produit
    document.querySelector("#ajouter-produit-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const produit = {
            nom: document.querySelector("#nom").value,
            taille: document.querySelector("#taille").value,
            couleur: document.querySelector("#couleur").value,
            matiere: document.querySelector("#matiere").value,
            quantite_stock: document.querySelector("#quantite").value,
            prix_unitaire: document.querySelector("#prix").value,
            idfournisseur: document.querySelector("#idfournisseur").value
        };

        fetch(apiBaseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produit)
        })
            .then(response => response.json())
            .then(() => {
                fetchProduits();
                e.target.reset();
            })
            .catch(error => console.error("Erreur ajout :", error));
    });

    // Modifier un produit
    window.modifierProduit = function (id) {
        const nom = prompt("Nouveau nom ?");
        if (!nom) return;
        const taille = prompt("Nouvelle taille?");
        if (!taille) return;
        const couleur = prompt("Nouvelle couleur ?");
        if (!couleur) return;
        const matiere = prompt("Nouvelle matiere ?");
        if (!matiere) return;
        const quantite_stock = prompt("Nouvelle quantité ?");
        if (!quantite_stock) return;
        const prix_unitaire = prompt("Nouveau prix ?");
        if (!prix_unitaire) return;
        const idfournisseur = prompt("Nouveau fournisseur ?");
        if (!idfournisseur) return;

        const produitModif1 = { nom };
        const produitModif2 = { taille };
        const produitModif3 = { couleur };
        const produitModif4 = { matiere };
        const produitModif5 = { quantite_stock };
        const produitModif6 = { prix_unitaire };
        const produitModif7 = { idfournisseur };

        fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produitModif1)
        })
        fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produitModif2)
        })
        fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produitModif3)
        })
        fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produitModif4)
        })
        fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produitModif5)
        })
        fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produitModif6)
        })
        fetch(`${apiBaseUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produitModif7)
        })
            .then(response => response.json())
            .then(() => fetchProduits())
            .catch(error => console.error("Erreur modification :", error));
    };

    // Supprimer un produit
    window.supprimerProduit = function (id) {
        if (!confirm("Supprimer ce produit ?")) return;

        fetch(`${apiBaseUrl}/${id}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(() => fetchProduits())
            .catch(error => console.error("Erreur suppression :", error));
    };

    fetchProduits();
});
