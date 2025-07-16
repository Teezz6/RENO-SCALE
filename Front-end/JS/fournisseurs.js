const formPopup = document.getElementById('addSupplierForm');
const openBtn = document.getElementById('addSupplierBtn');
const closeBtn = document.getElementById('closeFormBtn');
const form = document.getElementById('supplierForm');
const table = document.querySelector(".supplier-table tbody");

// Afficher le formulaire
openBtn.addEventListener('click', () => {
  formPopup.style.display = 'flex';
});

// Fermer le formulaire
closeBtn.addEventListener('click', () => {
  formPopup.style.display = 'none';
});

// Fermer si clic en dehors du formulaire
window.onclick = e => {
  if (e.target === formPopup) {
    formPopup.style.display = "none";
  }
};

// Gestion de la soumission du formulaire
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Récupération des valeurs des champs
  const nom = document.getElementById("nom").value;
  const contact = document.getElementById("contact").value;
  const livraison = document.getElementById("livraison").value;
  const email = document.getElementById("email").value;
  const telephone = document.getElementById("telephone").value;
  const origine = document.getElementById("origine_produit").value;

  // Création d'une nouvelle ligne dans le tableau
  const newRow = table.insertRow();
  newRow.innerHTML = `
    <td>${nom}</td>
    <td>${contact}</td>
    <td>${new Date(livraison).toLocaleDateString('fr-FR')}</td>
    <td>${email}</td>
    <td>${telephone}</td>
    <td>${origine}</td>
  `;

  // Fermer le popup et réinitialiser le formulaire
  formPopup.style.display = "none";
  form.reset();
});
