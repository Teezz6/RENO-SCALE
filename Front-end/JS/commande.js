let clientIdCounter = 1;
let clients = [];
let orderIdCounter = 1;

// ➤ Récupérer les lots enregistrés dans le localStorage
function loadAvailableLots() {
  return JSON.parse(localStorage.getItem('lotsStock')) || [];
}

document.addEventListener('DOMContentLoaded', () => {
  const saveClientBtn = document.getElementById('saveClientBtn');
  const submitOrderBtn = document.getElementById('submitOrderBtn');
  const ordersTableBody = document.querySelector('#ordersTable tbody');
  const addOrderBtn = document.getElementById('addOrderBtn');
  const orderForm = document.getElementById('orderForm');
  const lotsContainer = document.getElementById('lotsContainer');

  // ➤ Affiche le formulaire
  addOrderBtn.addEventListener('click', () => {
    orderForm.classList.remove('hidden');
    renderAvailableLots();
    updateClientSelect();
  });

  // ➤ Affiche les lots disponibles sous forme de cases à cocher
  function renderAvailableLots() {
    const lots = loadAvailableLots();
    lotsContainer.innerHTML = '';
    if (lots.length === 0) {
      lotsContainer.innerHTML = "<p>Aucun lot disponible pour le moment.</p>";
      return;
    }

    lots.forEach((lot, index) => {
      const div = document.createElement('div');
      div.classList.add('lot-checkbox');
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${index}" class="lot-select-checkbox">
          ${lot.nom_lot} - ${lot.description} (${lot.couleur}, ${lot.matiere})
        </label>
      `;
      lotsContainer.appendChild(div);
    });
  }

  // ➤ Ajoute un client
  saveClientBtn.addEventListener('click', () => {
    const name = document.getElementById('newClientName').value.trim();
    const phone = document.getElementById('newClientPhone').value.trim();
    const email = document.getElementById('newClientEmail').value.trim();

    if (!name || !phone || !email) {
      alert("Merci de remplir tous les champs du client.");
      return;
    }

    const newClient = {
      id: clientIdCounter++,
      name,
      phone,
      email
    };
    clients.push(newClient);
    updateClientSelect();
    alert(`Client ajouté : ${newClient.name} (ID : ${newClient.id})`);

    // Reset formulaire
    document.getElementById('newClientName').value = '';
    document.getElementById('newClientPhone').value = '';
    document.getElementById('newClientEmail').value = '';
  });

  // ➤ Met à jour la liste des clients
  function updateClientSelect() {
    const clientSelect = document.getElementById('clientSelect');
    if (!clientSelect) return;

    clientSelect.innerHTML = `<option value="">-- Sélectionner un client --</option>`;
    clients.forEach(client => {
      const option = document.createElement('option');
      option.value = client.id;
      option.textContent = `ID ${client.id} - ${client.name}`;
      clientSelect.appendChild(option);
    });
  }

  // ➤ Soumission commande
  submitOrderBtn.addEventListener('click', () => {
    const selectedClientId = parseInt(document.getElementById('clientSelect').value);
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    const selectedIndexes = Array.from(document.querySelectorAll('.lot-select-checkbox:checked')).map(cb => parseInt(cb.value));
    const allLots = loadAvailableLots();
    const selectedLots = selectedIndexes.map(index => allLots[index]);

    if (selectedLots.length === 0) {
      alert("Veuillez sélectionner au moins un lot.");
      return;
    }

    const orderNumber = `#${orderIdCounter++}`;
    const order = {
      id: orderNumber,
      clientName: client.name,
      status: "En attente",
      lots: selectedLots
    };

    addOrderToTable(order);
    orderForm.classList.add('hidden');
    lotsContainer.innerHTML = '';
  });

  // ➤ Ajoute la commande dans le tableau
  function addOrderToTable(order) {
    const row = document.createElement('tr');
    row.setAttribute('data-order-id', order.id);

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.clientName}</td>
      <td>
        <select class="status-dropdown">
          <option value="En attente" ${order.status === "En attente" ? 'selected' : ''}>En attente</option>
          <option value="Validé" ${order.status === "Validé" ? 'selected' : ''}>Validé</option>
          <option value="Annulé" ${order.status === "Annulé" ? 'selected' : ''}>Annulé</option>
        </select>
        <span class="badge status-badge ${getStatusClass(order.status)}">${order.status}</span>
      </td>
      <td>
        <button class="view-btn">Voir</button>
        <button class="edit-btn">Modifier</button>
        <button class="delete-btn">Supprimer</button>
      </td>
    `;

    ordersTableBody.appendChild(row);

    const badge = row.querySelector('.status-badge');
    const statusDropdown = row.querySelector('.status-dropdown');

    statusDropdown.addEventListener('change', () => {
      const newStatus = statusDropdown.value;
      badge.textContent = newStatus;
      badge.className = `badge status-badge ${getStatusClass(newStatus)}`;
    });

    row.querySelector('.view-btn').addEventListener('click', () => {
      let details = `Commande ${order.id}\nClient : ${order.clientName}\nStatut : ${statusDropdown.value}\nLots :\n`;
      order.lots.forEach((lot, i) => {
        details += `  Lot ${i + 1} - ${lot.nom_lot} | ${lot.description} | ${lot.couleur} | ${lot.matiere} | Qté: ${lot.quantite} | Prix: ${lot.prix_unitaire}€\n`;
      });
      alert(details);
    });

    row.querySelector('.edit-btn').addEventListener('click', () => {
      alert(`Fonctionnalité "Modifier" à implémenter pour la commande ${order.id}`);
    });

    row.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Supprimer la commande ${order.id} ?`)) {
        row.remove();
      }
    });
  }

  // ➤ Attribue une classe badge selon le statut
  function getStatusClass(status) {
    switch (status) {
      case 'Validé': return 'valide';
      case 'Annulé': return 'annule';
      default: return 'en-attente';
    }
  }
});
