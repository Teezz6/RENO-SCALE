// Sélecteurs généraux
const btnAddArticle = document.getElementById("btn-add-article");
const btnCreateLot = document.getElementById("btn-create-lot");
const popupForm = document.getElementById("popup-form");
const popupLot = document.getElementById("popup-lot");
const closePopupBtn = document.getElementById("close-popup");
const closeLotBtn = document.getElementById("close-lot-popup");

// Formulaires
const articleForm = document.getElementById("article-form");
const lotForm = document.getElementById("lot-form");

// Zones d'insertion
const stockBody = document.getElementById("stock-body");
const lotBody = document.getElementById("lot-body");
const lotProductsList = document.getElementById("lot-products-list");

// Champs article
const articleName = document.getElementById("article-name");
const articleQty = document.getElementById("article-qty");
const articleTaille = document.getElementById("article-taille");
const articleCouleur = document.getElementById("article-couleur");

// Champs lot
const lotName = document.getElementById("lot-name");
const lotDescription = document.getElementById("lot-description");
const addToLotBtn = document.getElementById("add-to-lot");

// -----------------------
// GESTION ARTICLES
// -----------------------
btnAddArticle.addEventListener("click", () => {
  popupForm.style.display = "flex";
});

closePopupBtn.addEventListener("click", () => {
  popupForm.style.display = "none";
  articleForm.reset();
});

articleForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = articleName.value;
  const qty = articleQty.value || "1";
  const taille = articleTaille.value;
  const couleur = articleCouleur.value;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td>${qty}</td>
    <td>${taille}</td>
    <td>${couleur}</td>
    <td>En stock</td>
    <td><button class="delete-btn">Supprimer</button></td>
  `;

  stockBody.appendChild(row);
  popupForm.style.display = "none";
  articleForm.reset();
});

// -----------------------
// GESTION LOTS
// -----------------------
btnCreateLot.addEventListener("click", () => {
  popupLot.style.display = "flex";
});

closeLotBtn.addEventListener("click", () => {
  popupLot.style.display = "none";
  lotForm.reset();
  lotProductsList.innerHTML = "";
});

// Ajout de produit au lot temporaire
addToLotBtn.addEventListener("click", () => {
  const ref = document.querySelector(".ref-input").value;
  const taille = document.querySelector(".taille-input").value;
  const couleur = document.querySelector(".couleur-input").value;
  const quantite = document.querySelector(".quantite-input").value;
  const prix = document.querySelector(".prix-input").value;

  if (!ref || !taille || !couleur || !quantite || !prix) return alert("Tous les champs du lot sont obligatoires");

  const li = document.createElement("li");
  li.textContent = `${ref} - Taille ${taille} - ${couleur} - Qté ${quantite} - ${prix}€/u`;
  lotProductsList.appendChild(li);

  // Nettoie les champs pour ajouter un autre produit
  document.querySelector(".ref-input").value = "";
  document.querySelector(".taille-input").selectedIndex = 0;
  document.querySelector(".couleur-input").selectedIndex = 0;
  document.querySelector(".quantite-input").value = "";
  document.querySelector(".prix-input").value = "";
});

// Création du lot
lotForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const idLot = "LOT-" + Date.now(); // ID unique
  const nom = lotName.value;
  const desc = lotDescription.value;
  const nbArticles = lotProductsList.children.length;

  if (nbArticles === 0) return alert("Ajoutez au moins un produit au lot");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${idLot}</td>
    <td>${nom}</td>
    <td>${desc}</td>
    <td>${nbArticles}</td>
    <td><button class="delete-btn">Supprimer</button></td>
  `;

  lotBody.appendChild(row);
  popupLot.style.display = "none";
  lotForm.reset();
  lotProductsList.innerHTML = "";
});

// -----------------------
// SUPPRESSION DYNAMIQUE
// -----------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const row = e.target.closest("tr");
    row.remove();
  }
});
