document.addEventListener("DOMContentLoaded", function () {
  const lotsTableBody = document.getElementById("lot-body");
  const popupLot = document.getElementById("popup-lot");
  const btnCreateLot = document.getElementById("btn-create-lot");
  const closeLotPopup = document.getElementById("close-lot-popup");
  const lotForm = document.getElementById("lot-form");

  const popupForm = document.getElementById("popup-form");
  const btnAddArticle = document.getElementById("btn-add-article");
  const closeFormPopup = document.getElementById("close-popup");
  const articleForm = document.getElementById("article-form");

  // Champs du formulaire "Créer un lot"
  const lotRefInput = document.getElementById("lot-ref");
  const tailleCheckboxes = document.querySelectorAll(".taille-checkbox");
  const couleurCheckboxes = document.querySelectorAll(".couleur-checkbox");
  const quantiteInput = document.querySelector(".quantite-input");
  const prixInput = document.querySelector(".prix-input");
  const addToLotBtn = document.getElementById("add-to-lot");
  const lotProductsList = document.getElementById("lot-products-list");

  // Variables pour stocker les articles ajoutés au lot
  let lotProduits = [];

  // Ouvrir / fermer popup création de lot
  btnCreateLot.addEventListener("click", () => {
    popupLot.style.display = "flex";
  });
  closeLotPopup.addEventListener("click", () => {
    popupLot.style.display = "none";
    resetLotForm();
  });

  // Ouvrir / fermer popup ajout article
  btnAddArticle.addEventListener("click", () => {
    popupForm.style.display = "flex";
  });
  closeFormPopup.addEventListener("click", () => {
    popupForm.style.display = "none";
  });

  // Fonction utilitaire pour récupérer valeurs cochées
  function getCheckedValues(nodeList) {
    return Array.from(nodeList).filter(input => input.checked).map(input => input.value);
  }

  // Ajouter un article dans le lot depuis la popup "Créer un lot"
  addToLotBtn.addEventListener("click", () => {
    const ref = lotRefInput.value.trim();
    const tailles = getCheckedValues(tailleCheckboxes);
    const couleurs = getCheckedValues(couleurCheckboxes);
    const quantite = parseInt(quantiteInput.value, 10);
    const prix = parseFloat(prixInput.value);

    if (!ref) {
      alert("Veuillez saisir la référence.");
      return;
    }
    if (tailles.length === 0) {
      alert("Veuillez sélectionner au moins une taille.");
      return;
    }
    if (couleurs.length === 0) {
      alert("Veuillez sélectionner au moins une couleur.");
      return;
    }
    if (isNaN(quantite) || quantite <= 0) {
      alert("Veuillez saisir une quantité valide (>0).");
      return;
    }
    if (isNaN(prix) || prix < 0) {
      alert("Veuillez saisir un prix valide (>=0).");
      return;
    }

    // Ajouter toutes les combinaisons taille/couleur
    tailles.forEach(taille => {
      couleurs.forEach(couleur => {
        lotProduits.push({
          ref,
          taille,
          couleur,
          quantite,
          prix,
        });
      });
    });

    renderLotProducts();
    resetLotProductInputs();
  });

  // Afficher la liste des articles ajoutés au lot
  function renderLotProducts() {
    lotProductsList.innerHTML = "";

    lotProduits.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.ref} - Taille: ${item.taille} - Couleur: ${item.couleur} - Qté: ${item.quantite} - Prix: ${item.prix.toFixed(2)} €`;

      // Bouton supprimer article
      const btnDelete = document.createElement("button");
      btnDelete.textContent = "Supprimer";
      btnDelete.style.marginLeft = "10px";
      btnDelete.addEventListener("click", () => {
        lotProduits.splice(index, 1);
        renderLotProducts();
      });

      li.appendChild(btnDelete);
      lotProductsList.appendChild(li);
    });
  }

  function resetLotProductInputs() {
    lotRefInput.value = "";
    tailleCheckboxes.forEach(cb => (cb.checked = false));
    couleurCheckboxes.forEach(cb => (cb.checked = false));
    quantiteInput.value = "";
    prixInput.value = "";
  }

  // Réinitialiser formulaire lot complet
  function resetLotForm() {
    lotForm.reset();
    resetLotProductInputs();
    lotProduits = [];
    renderLotProducts();
  }

  // Soumission formulaire création lot
  lotForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nomLot = document.getElementById("lot-name").value.trim();
    const descLot = document.getElementById("lot-description").value.trim();




    // Calcul quantité totale et prix total du lot
    const quantiteTotale = lotProduits.reduce((sum, p) => sum + p.quantite, 0);
    const prixTotal = lotProduits.reduce((sum, p) => sum + p.quantite * p.prix, 0);

    // Création de la ligne dans le tableau des lots
    const idLot = Date.now(); // simple id basé sur timestamp

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idLot}</td>
      <td>${nomLot}</td>
      <td>${descLot}</td>
      <td>${quantiteTotale}</td>
      <td>${prixTotal.toFixed(2)} €</td>
      <td>
        <button class="delete-lot-btn" title="Supprimer">🗑️</button>
      </td>
    `;

    // Supprimer lot
    tr.querySelector(".delete-lot-btn").addEventListener("click", () => {
      if (confirm(`Supprimer le lot "${nomLot}" ?`)) {
        tr.remove();
      }
    });

    lotsTableBody.appendChild(tr);

    // Reset formulaire et fermer popup
    resetLotForm();
    popupLot.style.display = "none";
  });

  // Formulaire ajout article (popup-form) - tu peux gérer ici si besoin la création/modification d'articles en stock
  articleForm.addEventListener("submit", (e) => {
    e.preventDefault();

    popupForm.style.display = "none";
  });
});
