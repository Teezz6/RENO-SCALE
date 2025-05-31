const formPopup = document.getElementById('addSupplierForm');
const openBtn = document.getElementById('addSupplierBtn');
const closeBtn = document.getElementById('closeFormBtn');
const form = document.getElementById('supplierForm');
const table = document.querySelector(".supplier-table tbody");

openBtn.addEventListener('click', () => {
  formPopup.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  formPopup.style.display = 'none';
});

window.onclick = e => {
  if (e.target === formPopup) {
    formPopup.style.display = "none";
  }
};

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nom = document.getElementById("nom").value;
  const contact = document.getElementById("contact").value;
  const livraison = document.getElementById("livraison").value;

  const newRow = table.insertRow();
  newRow.innerHTML = `<td>${nom}</td><td>${contact}</td><td>${new Date(livraison).toLocaleDateString('fr-FR')}</td>`;

  formPopup.style.display = "none";
  form.reset();
});
