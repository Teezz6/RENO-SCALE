document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    alert("Vous n'êtes pas connecté.");
    window.location.href = "pagedeconnexion.html";
    return;
  }

  const addOrderBtn = document.getElementById("addOrderBtn");
  const orderForm = document.getElementById("orderForm");

  addOrderBtn.addEventListener("click", () => {
   // Affiche le formulaire en retirant la classe 'hidden'
    orderForm.classList.remove("hidden");

    // (Optionnel) Réinitialiser les champs du formulaire
    document.getElementById("newClientName").value = "";
    document.getElementById("newClientEmail").value = "";
    document.getElementById("newClientPhone").value = "";
    document.getElementById("clientSearch").value = "";
    document.getElementById("clientSelect").innerHTML = "";
    lotsContainer.innerHTML = "";
    document.getElementById("orderStatus").value = "En attente";

    // Réinitialiser la sélection du client et les lots
    selectedClientId = null;
    lotCount = 0;
  });


  document.getElementById("saveClientBtn").addEventListener("click", async () => {
   const nom = document.getElementById("newClientName").value.trim();
   const email = document.getElementById("newClientEmail").value.trim();
   const telephone = document.getElementById("newClientPhone").value.trim();

   if (!nom || !email || !telephone) {
     alert("Veuillez remplir tous les champs client.");
     return;
   }

   const client = { nom, email, telephone };
   const token = localStorage.getItem("jwtToken");

   try {
     const res = await fetch("http://localhost/Dev_project/RENO-SCALE-1/Back-end/Routes/API/entite.php?url=Client", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "Authorization": "Bearer " + token
       },
       body: JSON.stringify(client)
     });

      const data = await res.json();
    
      if (!res.ok) {
       alert(data.error || "Erreur lors de l’ajout du client.");
       return;
      }

      alert("Client ajouté avec succès !");
    
     // Optionnel : effacer les champs après ajout
     document.getElementById("newClientName").value = "";
     document.getElementById("newClientEmail").value = "";
     document.getElementById("newClientPhone").value = "";

     // Optionnel : stocker l’ID du client pour préremplir la commande
     selectedClientId = data.idclient;  // stocke pour l’envoi final
     console.log("ID client enregistré :", selectedClientId);

    } catch (error) {
     console.error("Erreur JS :", error);
     alert("Erreur lors de l’envoi du client.");
    }
  });

  const clientSearchInput = document.getElementById("clientSearch");
  const clientSelect = document.getElementById("clientSelect");
  let selectedClientId = null;

  clientSearchInput.addEventListener("input", async () => {
   const searchTerm = clientSearchInput.value.trim();

   if (searchTerm.length < 2) {
     clientSelect.innerHTML = "";
     return;
   }

   const token = localStorage.getItem("jwtToken");

   try {
     const res = await fetch(`http://localhost/Dev_project/RENO-SCALE-1/Back-end/Routes/API/entite.php?url=Client&search=${encodeURIComponent(searchTerm)}`, {
       method: "GET",
       headers: {
         "Authorization": "Bearer " + token
       }
     });

     const clients = await res.json();

     clientSelect.innerHTML = "";

     if (clients.length === 0) {
       const option = document.createElement("option");
       option.textContent = "Aucun client trouvé";
       clientSelect.appendChild(option);
       return;
     }

     clients.forEach(client => {
       const option = document.createElement("option");
       option.value = client.idclient;
       option.textContent = `${client.nom} (${client.email})`;
       clientSelect.appendChild(option);
     });

    } catch (err) {
     console.error("Erreur de recherche client :", err);
     clientSelect.innerHTML = "<option>Erreur de recherche</option>";
    }
  });

  // Sélection d’un client dans la liste
  clientSelect.addEventListener("change", () => {
   selectedClientId = clientSelect.value;
   console.log("Client sélectionné :", selectedClientId);
  });

  const addLotBtn = document.getElementById("addLotBtn");
  const lotsContainer = document.getElementById("lotsContainer");
  let lotCount = 0;

  // Fonction pour créer un nouveau bloc de lot
  async function fetchLotsDisponibles() {
    try {
      const response = await fetch("http://localhost/Dev_project/RENO-SCALE-1/Back-end/Routes/API/entite.php?url=Lot", {
        method: "GET",
        headers: {
         "Content-Type": "application/json",
         "Authorization": "Bearer " + localStorage.getItem("jwtToken") // ou "token"
        }
      });

      if (!response.ok) {
       throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Données des lots :", data);
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement des lots :", error);
      return [];
    }
  }
  //Pour récupérer les commandes depuis l'API

  async function fetchCommandes() {
   const token = localStorage.getItem("jwtToken");
   const res = await fetch("192.168.1.10/var/www/html/Back-end/Routes/API/commande_liste.php", {
     method: "GET",
     headers: { "Authorization": "Bearer " + token }
   });
   const commandes = await res.json();

   const commandesTable = document.getElementById("commandesTableBody"); // tbody de ton tableau
   commandesTable.innerHTML = ""; // vider le tableau

   commandes.forEach(cmd => {
     const tr = document.createElement('tr');
     tr.innerHTML = `
       <td>${cmd.idcommande}</td>
       <td>${cmd.client_nom}</td>
       <td>${cmd.statut}</td>
       <td>
          button onclick="voirLot(${index})">Voir</button>
          <button onclick="modifierLotPopup(${index})">Modifier</button>
          <button onclick="supprimerLot(${index})">Supprimer</button>
       </td>
     `;
      commandesTable.appendChild(tr);
    });
  }
  fetchCommandes();



  // Quand on clique sur "Ajouter un lot", on affiche une ligne avec select des lots et quantité
  addLotBtn.addEventListener("click", async () => {
    lotCount++;
    const lots = await fetchLotsDisponibles();
    console.log("Réponse fetchLotsDisponibles :", lots);

    const lotDiv = document.createElement("div");
    lotDiv.className = "lot-item";
    lotDiv.dataset.lotIndex = lotCount;

    // Construction options pour le select
    const optionsHTML = lots.map(lot => 
     `<option value="${lot.idlot}">${lot.nom_lot}</option>`
    ).join("");


    lotDiv.innerHTML = `
      <h3>Lot n°${lotCount}</h3>
      <label>Choisir un lot :</label>
      <select class="lot-select" required>
        <option value="">-- Sélectionnez un lot --</option>
        ${optionsHTML}
      </select>

      <label>Quantité :</label>
      <input type="number" class="lot-qty" min="1" required />

      <button type="button" class="removeLotBtn">Supprimer ce lot</button>
      <hr />
    `;

    lotsContainer.appendChild(lotDiv);
  });

  // Suppression d’un lot
  lotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeLotBtn")) {
      const lotDiv = e.target.closest(".lot-item");
      lotsContainer.removeChild(lotDiv);
    }
  });

  document.getElementById("submitOrderBtn").addEventListener("click", async () => {
    if (!selectedClientId) {
      alert("Veuillez sélectionner ou ajouter un client pour la commande.");
      return;
    }

    const lotDivs = lotsContainer.querySelectorAll(".lot-item");
    if (lotDivs.length === 0) {
      alert("Veuillez ajouter au moins un lot à la commande.");
      return;
    }

    // Construire tableau lots avec idlot et quantité
    const lots = [];
    for (const lotDiv of lotDivs) {
      const idlot = lotDiv.querySelector(".lot-select").value;
      const qty = parseInt(lotDiv.querySelector(".lot-qty").value, 10);

      if (!idlot || isNaN(qty) || qty <= 0) {
        alert("Veuillez sélectionner un lot et saisir une quantité valide.");
        return;
      }

      lots.push({ idlot: parseInt(idlot, 10), quantite: qty });
    }

    const statut = document.getElementById("orderStatus").value;

    const commande = {
      idclient: selectedClientId,
      lots,
      statut
    };

    try {
      const res = await fetch("http://localhost/Dev_project/RENO-SCALE-1/Back-end/Routes/API/entite.php?url=Commande", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(commande)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erreur lors de la création de la commande.");
        return;
      }
      
      alert("Commande créée avec succès !");
        // Vider formulaire & liste
      selectedClientId = null;
      clientSelect.innerHTML = "";
      clientSearchInput.value = "";
      lotsContainer.innerHTML = "";
      document.getElementById("orderStatus").value = "En attente";
       // Cacher le formulaire
      orderForm.classList.add("hidden");
       // Rafraîchir la liste des commandes
      fetchCommandes();
      

    } catch (error) {
      console.error("Erreur JS :", error);
      alert("Erreur lors de l’envoi de la commande.");
    }
  });
});
