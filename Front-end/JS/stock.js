document.addEventListener("DOMContentLoaded", () => {
  const stockBody = document.getElementById("stock-body");
  const lotBody = document.getElementById("lot-body");

  const form = document.getElementById("article-form");
  const lotForm = document.getElementById("lot-form");

  const btnAddArticle = document.getElementById("btn-add-article");
  const btnCreateLot = document.getElementById("btn-create-lot");

  const popupForm = document.getElementById("popup-form");
  const popupLot = document.getElementById("popup-lot");
  const closePopup = document.getElementById("close-popup");
  const closeLotPopup = document.getElementById("close-lot-popup");

  const addToLotBtn = document.getElementById("add-to-lot");

  let produits = [];
  let lots = [];
  let currentLotItems = [];

  // -------------------- POPUP HANDLING --------------------
  btnAddArticle.addEventListener("click", () => {
    popupForm.style.display = "block";
  });

  btnCreateLot.addEventListener("click", () => {
    popupLot.style.display = "block";
  });

  closePopup.addEventListener("click", () => {
    popupForm.style.display = "none";
  });

  closeLotPopup.addEventListener("click", () => {
    popupLot.style.display = "none";
  });

  // -------------------- AJOUT PRODUIT --------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const produit = {
      ref: document.getElementById("produit-ref").value.trim(),
      nom: document.getElementById("produit-nom").value.trim(),
      taille: document.getElementById("produit-taille").value.trim(),
      matiere: document.getElementById("produit-matiere").value.trim(),
      couleur: document.getElementById("produit-couleur").value.trim(),
      quantite: Number(document.getElementById("produit-quantite").value),
      prix: Number(document.getElementById("produit-prix").value),
      statut: "Disponible"
    };

    produits.push(produit);
    afficherProduits();
    popupForm.style.display = "none";
    form.reset();
  });

  function afficherProduits() {
    stockBody.innerHTML = "";
    produits.forEach((p, index) => {
      stockBody.innerHTML += `
        <tr>
          <td>${p.ref}</td>
          <td>${p.nom}</td>
          <td>${p.taille}</td>
          <td>${p.matiere}</td>
          <td>${p.couleur}</td>
          <td>${p.quantite}</td>
          <td>${p.prix.toFixed(2)}€</td>
          <td>${p.statut}</td>
          <td>
            <button onclick="voirProduit(${index})">Voir</button>
            <button onclick="modifierProduit(${index})">Modifier</button>
            <button onclick="supprimerProduit(${index})">Supprimer</button>
          </td>
        </tr>`;
    });
  }

  // -------------------- GESTION LOT --------------------
  addToLotBtn.addEventListener("click", () => {
    const ref = document.getElementById("lot-reference").value.trim();
    const taille = document.getElementById("lot-taille").value.trim();
    const couleur = document.getElementById("lot-couleur").value.trim();
    const quantite = Number(document.getElementById("lot-quantite").value);

    if (ref && taille && couleur && quantite > 0) {
      currentLotItems.push({ ref, taille, couleur, quantite });
      alert("Article ajouté au lot !");
    } else {
      alert("Veuillez remplir tous les champs pour ajouter au lot.");
    }
  });

  lotForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (currentLotItems.length === 0) {
      alert("Ajoutez au moins un article au lot avant de le créer.");
      return;
    }

    const lot = {
      id: "LOT-" + Date.now(),
      nom: document.getElementById("lot-name").value.trim(),
      description: document.getElementById("lot-description").value.trim(),
      articles: [...currentLotItems],
      quantiteTotale: currentLotItems.reduce((sum, item) => sum + item.quantite, 0)
    };

    lots.push(lot);
    afficherLots();
    popupLot.style.display = "none";
    lotForm.reset();
    currentLotItems = [];
  });

  function afficherLots() {
    lotBody.innerHTML = "";
    lots.forEach((lot, index) => {
      lotBody.innerHTML += `
        <tr>
          <td>${lot.id}</td>
          <td>${lot.nom}</td>
          <td>${lot.description}</td>
          <td>${lot.quantiteTotale}</td>
          <td>
            <button onclick="voirLot(${index})">Voir</button>
            <button onclick="modifierLot(${index})">Modifier</button>
            <button onclick="supprimerLot(${index})">Supprimer</button>
          </td>
        </tr>`;
    });
  }

  // -------------------- FONCTIONS D'ACTIONS (Placeholder) --------------------
  window.voirProduit = function(index) {
    alert(`Produit : ${JSON.stringify(produits[index], null, 2)}`);
  };

  window.modifierProduit = function(index) {
    alert("Fonction de modification à implémenter !");
  };

  window.supprimerProduit = function(index) {
    if (confirm("Supprimer ce produit ?")) {
      produits.splice(index, 1);
      afficherProduits();
    }
  };

  window.voirLot = function(index) {
    alert(`Lot : ${JSON.stringify(lots[index], null, 2)}`);
  };

  window.modifierLot = function(index) {
    alert("Fonction de modification à implémenter !");
  };

  window.supprimerLot = function(index) {
    if (confirm("Supprimer ce lot ?")) {
      lots.splice(index, 1);
      afficherLots();
    }
  };
});
