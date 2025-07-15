
document.getElementById("searchInput").addEventListener("input", function () {
  const filter = this.value.toLowerCase();
  const rows = document.querySelectorAll("#tableLivraisons tbody tr");

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
});

// Formulaire d’ajout
document.getElementById("formLivraison").addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll("input");
  const num = inputs[0].value;
  const statut = inputs[1].value;
  const date = inputs[2].value;

  const tbody = document.querySelector("#tableLivraisons tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `<td>${num}</td><td>${statut}</td><td>${new Date(date).toLocaleDateString('fr-FR')}</td>`;
  tbody.appendChild(tr);

  this.reset();
  updateChart(); 
});


const ctx = document.getElementById("livraisonStatusChart").getContext("2d");
let livraisonChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Livrée", "En cours", "En attente"],
    datasets: [{
      label: "Livraisons",
      data: [18, 10, 2],
      backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      hoverOffset: 5
    }]
  },
  options: {
    responsive: false, 
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  }
});


function updateChart() {
  const rows = document.querySelectorAll("#tableLivraisons tbody tr");
  let livree = 0, enCours = 0, attente = 0;

  rows.forEach(row => {
    const statut = row.children[1].textContent.toLowerCase();
    if (statut.includes("livrée")) livree++;
    else if (statut.includes("cours")) enCours++;
    else if (statut.includes("attente")) attente++;
  });

  livraisonChart.data.datasets[0].data = [livree, enCours, attente];
  livraisonChart.update();
}
