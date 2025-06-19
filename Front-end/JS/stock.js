// Données d'exemple
const articles = [
  { nom: "Robe en soie", quantite: 23, taille: "M", couleur: "Noir" },
  { nom: "Blouse à volants", quantite: 10, taille: "S", couleur: "Blanc" },
  { nom: "Jean taille haute", quantite: 0, taille: "L", couleur: "Bleu" }
];

const tbody = document.getElementById("stock-body");
const tailleFilter = document.getElementById("taille-filter");
const couleurFilter = document.getElementById("couleur-filter");
const popup = document.getElementById("popup-form");
const closePopup = document.getElementById("close-popup");
const addBtn = document.querySelector(".add-article");
const form = document.getElementById("article-form");

function afficherArticles() {
  tbody.innerHTML = "";
  const taille = tailleFilter.value;
  const couleur = couleurFilter.value;

  articles
    .filter(a =>
      (taille === "all" || a.taille === taille) &&
      (couleur === "all" || a.couleur === couleur)
    )
    .forEach((article, index) => {
      const tr = document.createElement("tr");

      const statut =
        article.quantite === 0
          ? "Rupture"
          : article.quantite < 15
          ? "Stock faible"
          : "En stock";

      tr.innerHTML = `
        <td>${article.nom}</td>
        <td>${article.quantite}</td>
        <td class="${
          statut === "En stock"
            ? "stock-ok"
            : statut === "Stock faible"
            ? "stock-low"
            : "stock-out"
        }">${statut}</td>
        <td><button class="edit-btn" data-index="${index}">Modifier</button></td>
      `;

      tbody.appendChild(tr);
    });
}

// Filtres dynamiques
tailleFilter.addEventListener("change", afficherArticles);
couleurFilter.addEventListener("change", afficherArticles);

// Popup
addBtn.addEventListener("click", () => {
  form.reset();
  form.dataset.editingIndex = "";
  popup.style.display = "flex";
});

closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Gérer les clics sur "Modifier"
tbody.addEventListener("click", e => {
  if (e.target.classList.contains("edit-btn")) {
    const index = e.target.dataset.index;
    const article = articles[index];
    document.getElementById("article-name").value = article.nom;
    document.getElementById("article-qty").value = article.quantite;
    document.getElementById("article-taille").value = article.taille;
    document.getElementById("article-couleur").value = article.couleur;
    form.dataset.editingIndex = index;
    popup.style.display = "flex";
  }
});

// Formulaire ajout/modification d'article
form.addEventListener("submit", e => {
  e.preventDefault();
  const nom = document.getElementById("article-name").value.trim();
  const taille = document.getElementById("article-taille").value;
  const couleur = document.getElementById("article-couleur").value;

  const lotCount = parseInt(document.getElementById("lot-count").value);
  const qtyPerLot = parseInt(document.getElementById("qty-per-lot").value);
  const quantiteDirect = parseInt(document.getElementById("article-qty").value);

  let quantite = 0;
  if (!isNaN(lotCount) && !isNaN(qtyPerLot)) {
    quantite = lotCount * qtyPerLot;
  } else if (!isNaN(quantiteDirect)) {
    quantite = quantiteDirect;
  }

  if (nom && quantite > 0 && taille && couleur) {
    const editingIndex = form.dataset.editingIndex;
    if (editingIndex !== "") {
      articles[editingIndex] = { nom, quantite, taille, couleur };
    } else {
      articles.push({ nom, quantite, taille, couleur });
    }
    afficherArticles();
    form.reset();
    popup.style.display = "none";
  }
});

// Initialisation
afficherArticles();
