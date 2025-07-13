// Fonction de recherche dans les factures
document.querySelector("input[type='text']").addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  const rows = document.querySelectorAll("section.tables:first-of-type table tr");

  rows.forEach((row, index) => {
    if (index === 0) return; // ignorer l'entête
    row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
  });
});


