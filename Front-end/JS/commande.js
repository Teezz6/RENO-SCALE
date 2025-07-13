document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.orders-table tbody');
  const orderForm = document.getElementById('orderForm');
  const addOrderBtn = document.getElementById('addOrderBtn');
  const addLotBtn = document.getElementById('addLotBtn');
  const submitOrderBtn = document.getElementById('submitOrderBtn');
  const lotsContainer = document.getElementById('lotsContainer');

  const clientSelect = document.getElementById('clientSelect');
  const productSelect = document.getElementById('productSelect'); 

  
  const clients = ['ZARA France', 'Boutique Chic', 'Style & Co', 'Fashion Express'];

 
  const products = [
    { ref: 'PNT-001', name: 'Pantalon Classique', category: 'Pantalon', color: 'Noir', material: 'Coton' },
    { ref: 'JUP-010', name: 'Jupe Plissée', category: 'Jupe', color: 'Beige', material: 'Lin' },
    { ref: 'RBS-007', name: 'Robe d\'été', category: 'Robe', color: 'Rouge', material: 'Soie' }
  ];

  function populateClientSelect() {
    clients.forEach(client => {
      const option = document.createElement('option');
      option.value = client;
      clientSelect.appendChild(option);
    });
  }

  function attachViewButtonEvent(button) {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const orderId = row.children[0].textContent;
      const clientName = row.children[1].textContent;
      const status = row.children[2].textContent.trim();
      alert(`Détails de la commande\n\nCommande : ${orderId}\nClient : ${clientName}\nStatut : ${status}`);
    });
  }

  function attachBadgeEvent(badge) {
    badge.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const currentStatus = badge.textContent.trim();
      let nextStatus;

      switch (currentStatus) {
        case 'Réception':
          nextStatus = 'Préparation';
          badge.className = 'badge preparation';
          break;
        case 'Préparation':
          nextStatus = 'Livraison';
          badge.className = 'badge livraison';
          break;
        case 'Livraison':
          nextStatus = 'Réception';
          badge.className = 'badge reception';
          break;
        default:
          nextStatus = 'Réception';
          badge.className = 'badge reception';
      }

      badge.textContent = nextStatus;
    });
  }

  // Initialisation des événements
  document.querySelectorAll('.view-btn').forEach(attachViewButtonEvent);
  document.querySelectorAll('.badge').forEach(attachBadgeEvent);

  addOrderBtn.addEventListener('click', () => {
    orderForm.classList.toggle('hidden');
  });

  addLotBtn.addEventListener('click', () => {
    const lotDiv = document.createElement('div');
    lotDiv.className = 'lot-block';

    // Ajout d’un bloc lot avec filtre produit
    lotDiv.innerHTML = `
      <label>Produit :
        <select class="product-dropdown">
          ${products.map(p => `
            <option value="${p.ref}">${p.ref} - ${p.name}</option>
          `).join('')}
        </select>
      </label>
      <label>Couleur :
        <input type="text" class="lot-color" placeholder="Ex : Rouge" />
      </label>
      <label>Matière :
        <input type="text" class="lot-material" placeholder="Ex : Coton" />
      </label>
      <label>Détails par taille :</label>
      <div class="sizes">
        ${['XS','S','M','L','XL'].map(size => `
          <label>${size} :
            <input type="number" min="0" class="size-${size}" value="0" />
          </label>
        `).join('')}
      </div>
    `;
    lotsContainer.appendChild(lotDiv);
  });

  submitOrderBtn.addEventListener('click', () => {
    const clientName = document.getElementById('clientName').value.trim();
    if (!clientName) {
      alert("Veuillez sélectionner une entreprise cliente.");
      return;
    }

    const lots = [];
    document.querySelectorAll('.lot-block').forEach((lotDiv) => {
      const productRef = lotDiv.querySelector('.product-dropdown').value;
      const color = lotDiv.querySelector('.lot-color').value;
      const material = lotDiv.querySelector('.lot-material').value;
      const sizes = {};
      ['XS','S','M','L','XL'].forEach(size => {
        sizes[size] = parseInt(lotDiv.querySelector(`.size-${size}`).value) || 0;
      });
      lots.push({ productRef, color, material, sizes });
    });

    const orderNumber = `#${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${orderNumber}</td>
      <td>${clientName}</td>
      <td><span class="badge reception">Réception</span></td>
      <td><button class="view-btn">Voir</button></td>
    `;

    tableBody.appendChild(row);
    attachViewButtonEvent(row.querySelector('.view-btn'));
    attachBadgeEvent(row.querySelector('.badge'));

    orderForm.classList.add('hidden');
    lotsContainer.innerHTML = '';
    document.getElementById('clientName').value = '';

    alert(`Commande enregistrée pour ${clientName} avec ${lots.length} lot(s).`);
    console.log("Nouvelle commande :", { client: clientName, lots });
  });

  populateClientSelect(); 
});
