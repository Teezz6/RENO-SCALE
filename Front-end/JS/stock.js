document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    alert("Vous n'êtes pas connecté.");
    window.location.href = "pagedeconnexion.html";
    return;
  }

  const API_BASE = "http://web.fashionchic.local/Back-end/Routes/API/entite.php?url=";

  const stockBody = document.getElementById("stock-body");
  const lotBody = document.getElementById("lot-body");

  const form = document.getElementById("article-form");
  const lotForm = document.getElementById("lot-form");

  const btnAddArticle = document.getElementById("btn-add-article");
  const btnCreateLot = document.getElementById("btn-create-lot");

  // Popups produit et lot (création + modification)
  const popupForm = document.getElementById("popup-form");
  const popupLot = document.getElementById("popup-lot");
  const closePopup = document.getElementById("close-popup");
  const closeLotPopup = document.getElementById("close-lot-popup");

  // Popups modif produit & lot
  const popupEditProduit = document.getElementById("popup-edit-produit");
  const closeEditProduit = document.getElementById("close-edit-produit");

  const popupEditLot = document.getElementById("popup-edit-lot");
  const closeEditLot = document.getElementById("close-edit-lot");

  const addToLotBtn = document.getElementById("add-to-lot");

  let produits = [];
  let lots = [];
  let currentLotItems = [];

  // Ouvrir les popups création
  btnAddArticle.addEventListener("click", () => { popupForm.style.display = "block"; });
  btnCreateLot.addEventListener("click", () => { popupLot.style.display = "block"; });

  // Fermer popups création
  closePopup.addEventListener("click", () => { popupForm.style.display = "none"; });
  closeLotPopup.addEventListener("click", () => { popupLot.style.display = "none"; });

  // Fermer popups modification
  closeEditProduit.addEventListener("click", () => { popupEditProduit.style.display = "none"; });
  closeEditLot.addEventListener("click", () => { popupEditLot.style.display = "none"; });

  // Chargement des produits
  async function loadProduits() {
    try {
      const response = await fetch(API_BASE + "Produit", { headers: { Authorization: "Bearer " + token } });
      if (!response.ok) throw new Error("Erreur chargement produits");
      produits = await response.json();
      afficherProduits();
    } catch (e) {
      console.error(e);
      showToast("Erreur chargement produits", true);
    }
  }

  // Chargement des lots
  async function loadLots() {
    try {
      console.log("Produits envoyés :", currentLotItems);
      const response = await fetch(API_BASE + "Lot", { headers: { Authorization: "Bearer " + token } });
      if (!response.ok) throw new Error("Erreur chargement lots");
      lots = await response.json();
      afficherLots();
    } catch (e) {
      console.error(e);
      showToast("Erreur chargement lots", true);
    }
  }

  loadProduits();
  loadLots();

  // Ajouter produit
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const produit = {
      reference: document.getElementById("produit-ref").value.trim(),
      nom: document.getElementById("produit-nom").value.trim(),
      taille: document.getElementById("produit-taille").value.trim(),
      matiere: document.getElementById("produit-matiere").value.trim(),
      couleur: document.getElementById("produit-couleur").value.trim(),
      quantite_stock: Number(document.getElementById("produit-quantite").value),
      prix_unitaire: Number(document.getElementById("produit-prix").value),
    };
    try {
      const res = await fetch(API_BASE + "Produit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(produit),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Erreur ajout produit", true);
        return;
      }
      showToast("Produit ajouté avec succès", false);
      form.reset();
      popupForm.style.display = "none";
      await loadProduits();
    } catch (e) {
      console.error(e);
      showToast("Erreur lors de l'ajout du produit", true);
    }
  });

  // Ajouter au lot 
  addToLotBtn.addEventListener("click", () => {
    const reference = document.getElementById("lot-reference").value.trim();
    const taille = document.getElementById("lot-taille").value.trim();
    const couleur = document.getElementById("lot-couleur").value.trim();
    const quantite = parseInt(document.getElementById("lot-quantite").value);

    const produit = produits.find(p => p.reference === reference && p.taille === taille && p.couleur === couleur);
    if (!produit) {
      showToast("Produit non trouvé avec ces caractéristiques", true);
      return;
    }
    if (quantite > produit.quantite_stock) {
      showToast("Quantité demandée supérieure au stock disponible", true);
      return;
    }

    produit.quantite_stock -= quantite;
    currentLotItems.push({ ref, taille, couleur, quantite });
    afficherProduits();
    showToast("Produit ajouté au lot", false);
  });

  // Création lot
  lotForm.addEventListener("submit", async e => {
    e.preventDefault();
    const nom_lot = document.getElementById("lot-name").value.trim();
    const description = document.getElementById("lot-description").value.trim();

    if (currentLotItems.length === 0) {
      showToast("Aucun produit ajouté au lot", true);
      return;
    }
    const quantiteTotale = currentLotItems.reduce((sum, item) => sum + item.quantite, 0);

    const nouveauLot = {
      nom_lot,
      description,
      produits: currentLotItems,
    };

    try {
      const res = await fetch(API_BASE + "Lot", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify(nouveauLot),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Erreur création lot", true);
        return;
      }
      showToast("Lot créé avec succès", false);
      currentLotItems = [];
      lotForm.reset();
      popupLot.style.display = "none";
      await loadProduits();
      await loadLots();
    } catch (e) {
      console.error(e);
      showToast("Erreur lors de la création du lot", true);
    }
  });

  // Affichage produits (quantité en rouge si < 10)
  function afficherProduits() {
    stockBody.innerHTML = "";
    produits.forEach((p, index) => {
      stockBody.innerHTML += `
        <tr>
          <td>${p.reference}</td>
          <td>${p.nom}</td>
          <td>${p.taille}</td>
          <td>${p.matiere}</td>
          <td>${p.couleur}</td>
          <td style="color:${p.quantite_stock < 10 ? 'red' : 'black'}">${p.quantite_stock}</td>
          <td>${parseFloat(p.prix_unitaire).toFixed(2)}€</td>
          <td>
            <button onclick="voirProduit(${index})">Voir</button>
            <button onclick="modifierProduitPopup(${index})">Modifier</button>
            <button onclick="supprimerProduit(${index})">Supprimer</button>
          </td>
        </tr>
      `;
    });
  }

  // Affichage lots
  function afficherLots() {
    lotBody.innerHTML = "";
    lots.forEach((lot, index) => {
      // Quantité totale de lot à partir de lot_produit, ici supposée dans lot.quantite_lot ou calculée
      lots.forEach((lot) => {
       fetch(`${window.location.origin}/Dev_project/RENO-SCALE-1/Back-end/Routes/API/lot.php?idlot=${lot.idlot}`)
         .then(response => response.json())
         .then(produits => {
         if (!Array.isArray(produits)) {
           console.warn("Le backend n’a pas renvoyé un tableau :", produits);
           return;
          }

         const quantiteTotale = produits.reduce((somme, produit) => {
           return somme + parseInt(produit.quantite_lot);
          }, 0);

         console.log(`Quantité totale du lot ${lot.idlot} :`, quantiteTotale);
        });
      });

      lotBody.innerHTML += `
        <tr>
          <td>${lot.nom_lot}</td>
          <td>${lot.description}</td>
          <td>${lot.quantiteTotale}</td>
          <td>
            <button onclick="voirLot(${index})">Voir</button>
            <button onclick="modifierLotPopup(${index})">Modifier</button>
            <button onclick="supprimerLot(${index})">Supprimer</button>
          </td>
        </tr>
      `;
    });
  }

  // Voir produit
  window.voirProduit = index => {
    const p = produits[index];
    alert(`Produit:\nRéf: ${p.reference}\nNom: ${p.nom}\nTaille: ${p.taille}\nMatière: ${p.matiere}\nCouleur: ${p.couleur}\nQuantité: ${p.quantite_stock}\nPrix: ${p.prix_unitaire}€`);
  };

  // Voir lot
  window.voirLot = index => {
    const lot = lots[index];
    const details = lot.produits.map(p => `- ${p.ref} (${p.taille}, ${p.couleur}): ${p.quantite}`).join("\n");
    alert(`Lot: ${lot.nom}\nDescription: ${lot.description}\nProduits:\n${details}`);
  };

  // Modifier produit - afficher popup avec données pré-remplies
  window.modifierProduitPopup = index => {
    const p = produits[index];
    const popup = document.getElementById("popup-edit-produit");
    popup.style.display = "block";

    popup.querySelector("#edit-ref").value = p.reference;
    popup.querySelector("#edit-nom").value = p.nom;
    popup.querySelector("#edit-taille").value = p.taille;
    popup.querySelector("#edit-matiere").value = p.matiere;
    popup.querySelector("#edit-couleur").value = p.couleur;
    popup.querySelector("#edit-quantite").value = p.quantite_stock;
    popup.querySelector("#edit-prix").value = p.prix_unitaire;

    popup.querySelector("#save-produit").onclick = async () => {
      const modif = {
        reference: popup.querySelector("#edit-ref").value.trim(),
        nom: popup.querySelector("#edit-nom").value.trim(),
        taille: popup.querySelector("#edit-taille").value.trim(),
        matiere: popup.querySelector("#edit-matiere").value.trim(),
        couleur: popup.querySelector("#edit-couleur").value.trim(),
        quantite_stock: Number(popup.querySelector("#edit-quantite").value),
        prix_unitaire: Number(popup.querySelector("#edit-prix").value),
      };
      try {
        const res = await fetch(API_BASE + "Produit/" + encodeURIComponent(p.reference), {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify(modif),
        });
        if (!res.ok) {
          const err = await res.json();
          showToast(err.error || "Erreur modification produit", true);
          return;
        }
        showToast("Produit modifié avec succès", false);
        popup.style.display = "none";
        await loadProduits();
      } catch (e) {
        console.error(e);
        showToast("Erreur modification produit", true);
      }
    };
  };

  // Modifier lot - similaire à produit (popup + envoi PUT)
  window.modifierLotPopup = index => {
    const lot = lots[index];
    const popup = document.getElementById("popup-edit-lot");
    popup.style.display = "block";

    popup.querySelector("#edit-lot-nom").value = lot.nom;
    popup.querySelector("#edit-lot-description").value = lot.description;
    // On peut ajouter ici gestion modif produits du lot si besoin
    popup.querySelector("#lot-produits-container").innerHTML = "";

    lot.produits.forEach((produit, i) => {
      const produitDiv = document.createElement("div");
      produitDiv.classList.add("produit-item");
      produitDiv.innerHTML = `
      <p><strong>Produit ${i + 1}</strong></p>
      <label>Référence : ${produit.reference}</label><br/>
      <label>Nom : ${produit.nom}</label><br/>
      <label>Taille : <input type="text" value="${produit.taille}" data-index="${i}" class="edit-produit-taille" /></label>
      <label>Couleur : <input type="text" value="${produit.couleur}" data-index="${i}" class="edit-produit-couleur" /></label>
      <label>Quantité : <input type="number" value="${produit.quantite}" data-index="${i}" class="edit-produit-quantite" min="1" /></label>
      <hr/>
     `;
      popup.querySelector("#lot-produits-container").appendChild(produitDiv);
    });

    popup.querySelector("#save-lot").onclick = async () => {
      // Mise à jour des produits modifiés
      const produitsModifies = lot.produits.map((prod, i) => ({
        ...prod,
        taille: popup.querySelector(`.edit-produit-taille[data-index="${i}"]`).value.trim(),
        couleur: popup.querySelector(`.edit-produit-couleur[data-index="${i}"]`).value.trim(),
        quantite: parseInt(popup.querySelector(`.edit-produit-quantite[data-index="${i}"]`).value, 10),
      }));

      const modif = {
       nom: popup.querySelector("#edit-lot-nom").value.trim(),
       description: popup.querySelector("#edit-lot-description").value.trim(),
       produits: produitsModifies,
      };

      try {
        const res = await fetch(API_BASE + "Lot/" + encodeURIComponent(lot.id), {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
          body: JSON.stringify(modif),
        });
        if (!res.ok) {
          const err = await res.json();
          showToast(err.error || "Erreur modification lot", true);
          return;
        }
        showToast("Lot modifié avec succès", false);
        popup.style.display = "none";
        await loadLots();
      } catch (e) {
        console.error(e);
        showToast("Erreur modification lot", true);
      }
    };
  };

  // Supprimer produit
  window.supprimerProduit = async index => {
    const p = produits[index];
    if (!confirm(`Supprimer le produit ${p.reference} ?`)) return;
    try {
      const res = await fetch(API_BASE + "Produit/" + encodeURIComponent(p.reference), {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Erreur suppression produit", true);
        return;
      }
      showToast("Produit supprimé", false);
      await loadProduits();
    } catch (e) {
      console.error(e);
      showToast("Erreur suppression produit", true);
    }
  };

  // Supprimer lot
  window.supprimerLot = async index => {
    const lot = lots[index];
    if (!confirm(`Supprimer le lot ${lot.nom} ?`)) return;
    try {
      const res = await fetch(API_BASE + "Lot/" + encodeURIComponent(lot.id), {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || "Erreur suppression lot", true);
        return;
      }
      showToast("Lot supprimé", false);
      await loadLots();
    } catch (e) {
      console.error(e);
      showToast("Erreur suppression lot", true);
    }
  };

  // Toast notification simple
  function showToast(message, isError) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "10px";
    toast.style.right = "10px";
    toast.style.padding = "10px 20px";
    toast.style.color = "#fff";
    toast.style.backgroundColor = isError ? "red" : "green";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
});
