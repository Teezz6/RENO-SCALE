document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.orders-table tbody');
  const orderForm = document.getElementById('orderForm');
  const addOrderBtn = document.getElementById('addOrderBtn');
  const addLotBtn = document.getElementById('addLotBtn');
  const submitOrderBtn = document.getElementById('submitOrderBtn');
  const lotsContainer = document.getElementById('lotsContainer');

  // Fonction pour attacher les événements à un bouton "Voir"
  function attachViewButtonEvent(button) {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const orderId = row.children[0].textContent;
      const clientName = row.children[1].textContent;
      const status = row.children[2].textContent.trim();
      alert(`Détails de la commande\n\nCommande : ${orderId}\nClient : ${clientName}\nStatut : ${status}`);
    });
  }

  // Fonction pour attacher l'événement de changement de statut
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

  // Initialisation : attacher les événements aux éléments déjà présents
  document.querySelectorAll('.view-btn').forEach(attachViewButtonEvent);
  document.querySelectorAll('.badge').forEach(attachBadgeEvent);

  // Affichage/Masquage du formulaire
  addOrderBtn.addEventListener('click', () => {
    orderForm.classList.toggle('hidden');
  });

  // Ajouter un bloc de lot
  addLotBtn.addEventListener('click', () => {
    const lotDiv = document.createElement('div');
    lotDiv.className = 'lot-block';
    lotDiv.innerHTML = `
      <label>Type de vêtement :
        <input type="text" class="lot-type" placeholder="Ex : Robes" />
      </label>
      <label>Couleur :
        <input type="text" class="lot-color" placeholder="Ex : Rouge" />
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

  // Valider une nouvelle commande
  submitOrderBtn.addEventListener('click', () => {
    const clientName = document.getElementById('clientName').value.trim();
    if (!clientName) {
      alert("Veuillez entrer un nom de client.");
      return;
    }

    const lots = [];
    document.querySelectorAll('.lot-block').forEach((lotDiv) => {
      const type = lotDiv.querySelector('.lot-type').value;
      const color = lotDiv.querySelector('.lot-color').value;
      const sizes = {};
      ['XS','S','M','L','XL'].forEach(size => {
        sizes[size] = parseInt(lotDiv.querySelector(`.size-${size}`).value) || 0;
      });
      lots.push({ type, color, sizes });
    });

    // Générer un numéro de commande
    const orderNumber = `#${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;

    // Créer la ligne HTML
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${orderNumber}</td>
      <td>${clientName}</td>
      <td><span class="badge reception">Réception</span></td>
      <td><button class="view-btn">Voir</button></td>
    `;

    // Ajouter au tableau
    tableBody.appendChild(row);

    // Attacher les événements
    attachViewButtonEvent(row.querySelector('.view-btn'));
    attachBadgeEvent(row.querySelector('.badge'));

    // Réinitialiser le formulaire
    orderForm.classList.add('hidden');
    lotsContainer.innerHTML = '';
    document.getElementById('clientName').value = '';

    alert(`Commande pour ${clientName} enregistrée avec ${lots.length} lot(s).`);
    console.log("Commande enregistrée :", {
      client: clientName,
      lots: lots
    });
  });
});
