document.addEventListener('DOMContentLoaded', () => {
  const viewButtons = document.querySelectorAll('.view-btn');

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const row = button.closest('tr');
      const orderId = row.children[0].textContent;
      const clientName = row.children[1].textContent;
      const status = row.children[2].textContent.trim();

     
      alert(`Détails de la commande\n\nCommande : ${orderId}\nClient : ${clientName}\nStatut : ${status}`);

    });
  });

  const badges = document.querySelectorAll('.badge');
  badges.forEach((badge) => {
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
  });
});
