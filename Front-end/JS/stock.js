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
    .forEach(article => {
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
        <td><button class="edit-btn">Modifier</button></td>
      `;

      tbody.appendChild(tr);
    });
}

// Filtres dynamiques
tailleFilter.addEventListener("change", afficherArticles);
couleurFilter.addEventListener("change", afficherArticles);

// Popup
addBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Formulaire ajout article
form.addEventListener("submit", e => {
  e.preventDefault();
  const nom = document.getElementById("article-name").value;
  const quantite = parseInt(document.getElementById("article-qty").value);
  const taille = document.getElementById("article-taille").value;
  const couleur = document.getElementById("article-couleur").value;

  if (nom && !isNaN(quantite) && taille && couleur) {
    articles.push({ nom, quantite, taille, couleur });
    afficherArticles();
    form.reset();
    popup.style.display = "none";
  }
});

// Initialisation
afficherArticles();
