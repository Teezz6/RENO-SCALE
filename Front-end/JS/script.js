document.addEventListener("DOMContentLoaded", function () {
  // ======= GESTION DU MENU ACTIF =======
  const links = document.querySelectorAll(".sidebar ul li a");

  links.forEach(link => {
    link.addEventListener("click", function () {
      links.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // ======= FILTRAGE PAR BARRE DE RECHERCHE =======
  const searchInput = document.getElementById("searchInput");
  const tableRows = document.querySelectorAll("#commandesTable tbody tr");

  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const searchTerm = this.value.toLowerCase();
      tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchTerm) ? "" : "none";
      });
    });
  }

  // ======= GRAPHIQUE BARRES : Commandes annuelles =======
  const barChart = document.getElementById("commandeChart");
  if (barChart) {
    new Chart(barChart, {
      type: "bar",
      data: {
        labels: ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          label: "Nombre de commandes",
          data: [8, 12, 5, 15, 20, 10, 18, 14, 16, 13, 9, 7],
          backgroundColor: "rgba(165, 135, 104, 0.89)",
          borderColor: "rgb(233, 195, 180)",
          borderWidth: 1
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
  }

  // ======= GRAPHIQUE CAMEMBERT : Statuts de commandes =======
  const pieChart = document.getElementById("commandeStatusChart");
  if (pieChart) {
    new Chart(pieChart, {
      type: "pie",
      data: {
        labels: ['Livrée', 'En cours', 'Annulée'],
        datasets: [{
          label: "Répartition des statuts",
          data: [45, 30, 25], // Exemple de données
          backgroundColor: [
            "rgb(236, 219, 172)",
            "rgba(116, 112, 101, 0.32)",
            "rgb(236, 223, 213)"
          ],
          borderColor: [
            "rgb(236, 219, 172)",
            "rgba(116, 112, 101, 0.32)",
            "rgb(236, 223, 213)"
          ],
          borderWidth: 1
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
  }
});
