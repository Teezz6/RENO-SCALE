document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const data = {
    email,
    mot_passe: password
  };

  try {
    // Envoi des données login
    const response = await fetch('http://web/RENO-SCALE-1/Back-end/Routes/API/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      // PAS besoin de credentials ici, car pas de session
    });

    const result = await response.json();

    console.log("Token reçu :", result.token);


    if (!response.ok || result.status !== 'success') {
      document.getElementById('message').textContent = result.message || "Erreur lors de la connexion.";
      return;
    }

    // Stocker le token JWT (localStorage ou sessionStorage)
    localStorage.setItem('jwtToken', result.token);

    // Récupérer le rôle via dashboard.php avec le token
    const token = localStorage.getItem('jwtToken');
    const roleResponse = await fetch('http://web/RENO-SCALE-1/Back-end/Routes/API/dashboard.php', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + result.token
      }
    });

    const roleData = await roleResponse.json();

    if (roleData.status === 'success') {
      const role = roleData.role;

      switch (role) {
        case 'admin':
          window.location.href = '../pages/pageadmin.html';
          break;
        case 'comptable':
          window.location.href = '../pages/pagecomptabilite.html';
          break;
        case 'livreur':
          window.location.href = '../pages/pagelivraison.html';
        case 'préparateur de commande':
          window.location.href = '../pages/pagecommande.html';
          break;
        case 'commercial':
          window.location.href = '../pages/pagecommande.html';
          break;
        case 'responsable de stock':
          window.location.href = '../pages/pagestock.html';
          break;
        default:
          document.getElementById('message').textContent = "Rôle utilisateur inconnu.";
          break;
      }
    } else {
      document.getElementById('message').textContent = roleData.message || "Impossible de récupérer le rôle utilisateur.";
    }
  } catch (error) {
    console.error(error);
    document.getElementById('message').textContent = "Une erreur est survenue lors de la connexion.";
  }
});
