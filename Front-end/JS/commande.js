let clientIdCounter = 1; 
let clients = [];
let orderIdCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
  const saveClientBtn = document.getElementById('saveClientBtn');
  const submitOrderBtn = document.getElementById('submitOrderBtn');
  const ordersTableBody = document.querySelector('#ordersTable tbody');
  const addOrderBtn = document.getElementById('addOrderBtn');
  const orderForm = document.getElementById('orderForm');
  const addLotBtn = document.getElementById('addLotBtn');
  const lotsContainer = document.getElementById('lotsContainer');

  // ➤ Afficher le formulaire de commande
  addOrderBtn.addEventListener('click', () => {
    orderForm.classList.remove('hidden');
  });

  // ✅ ➤ Ajout d'un lot
  if (addLotBtn) {
    addLotBtn.addEventListener('click', () => {
      const lotBlock = createLotBlock();
      lotsContainer.appendChild(lotBlock);
    });
  }

  // ✅ ➤ Fonction pour créer dynamiquement un bloc de lot
  function createLotBlock() {
    const div = document.createElement('div');
    div.classList.add('lot-block');
    div.innerHTML = `
      <hr>
      <label>Produit :</label>
      <select class="product-dropdown">
        <option value="pant">Pantalon</option>
        <option value="rob">Robe</option>
        <option value="tsh">T-shirt</option>
        <option value="che">Chemise</option>
      </select>
      <input type="text" placeholder="Couleur" class="lot-color">
      <input type="text" placeholder="Matière" class="lot-material">
      <input type="number" placeholder="XS" class="size-XS" min="0">
      <input type="number" placeholder="S" class="size-S" min="0">
      <input type="number" placeholder="M" class="size-M" min="0">
      <input type="number" placeholder="L" class="size-L" min="0">
      <input type="number" placeholder="XL" class="size-XL" min="0">
    `;
    return div;
  }

  // ➤ Ajout d'un client
  if (saveClientBtn) {
    saveClientBtn.addEventListener('click', () => {
      const name = document.getElementById('newClientName').value.trim();
      const phone = document.getElementById('newClientPhone').value.trim();
      const email = document.getElementById('newClientEmail').value.trim();
      const address = document.getElementById('newClientAddress').value.trim();

      if (!name || !phone || !email || !address) {
        alert("Merci de remplir tous les champs du client.");
        return;
      }

      const newClient = {
        id: clientIdCounter++,
        name,
        phone,
        email,
        address
      };
      clients.push(newClient);
      updateClientSelect();
      alert(`Client ajouté : ${newClient.name} (ID : ${newClient.id})`);

      document.getElementById('newClientName').value = '';
      document.getElementById('newClientPhone').value = '';
      document.getElementById('newClientEmail').value = '';
      document.getElementById('newClientAddress').value = '';
    });
  }

  // ➤ Met à jour la liste déroulante des clients
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

  // ➤ Soumission de commande
  if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', () => {
      const selectedClientId = parseInt(document.getElementById('clientSelect').value);
      const client = clients.find(c => c.id === selectedClientId);
      if (!client) {
        alert("Veuillez sélectionner un client.");
        return;
      }

      const lots = [];
      document.querySelectorAll('.lot-block').forEach((lotDiv) => {
        const productRef = lotDiv.querySelector('.product-dropdown')?.value;
        const color = lotDiv.querySelector('.lot-color')?.value;
        const material = lotDiv.querySelector('.lot-material')?.value;
        const sizes = {};
        ['XS', 'S', 'M', 'L', 'XL'].forEach(size => {
          sizes[size] = parseInt(lotDiv.querySelector(`.size-${size}`)?.value) || 0;
        });
        lots.push({ productRef, color, material, sizes });
      });

      if (lots.length === 0) {
        alert("Ajoutez au moins un lot à la commande.");
        return;
      }

      const orderNumber = `#${orderIdCounter++}`;
      const order = {
        id: orderNumber,
        clientName: client.name,
        status: "En attente de préparation",
        lots: lots
      };

      addOrderToTable(order);
      orderForm.classList.add('hidden');
      lotsContainer.innerHTML = ''; // on vide les lots après validation
    });
  }

  // ➤ Ajoute la commande au tableau
  function addOrderToTable(order) {
    const row = document.createElement('tr');
    row.setAttribute('data-order-id', order.id);
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.clientName}</td>
      <td><span class="badge en-attente">${order.status}</span></td>
      <td>
        <button class="view-btn">Voir</button>
        <button class="edit-btn">Modifier</button>
        <button class="delete-btn">Supprimer</button>
      </td>
    `;
    if (ordersTableBody) {
      ordersTableBody.appendChild(row);
    }

    row.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Supprimer la commande ${order.id} ?`)) {
        row.remove();
      }
    });

    row.querySelector('.edit-btn').addEventListener('click', () => {
      alert(`Fonction de modification à développer pour ${order.id}`);
    });

    row.querySelector('.view-btn').addEventListener('click', () => {
      let details = `Commande ${order.id}\nClient : ${order.clientName}\nStatut : ${order.status}\nLots :\n`;
      order.lots.forEach((lot, index) => {
        details += `  Lot ${index + 1} - ${lot.productRef} | ${lot.color} | ${lot.material} | Tailles : ${JSON.stringify(lot.sizes)}\n`;
      });
      alert(details);
    });
  }
});
