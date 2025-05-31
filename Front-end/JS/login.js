document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const data = {
    email,
    mot_passe: password
  };

  try {
    // Étape 1 : tentative de connexion
    const response = await fetch('http://web/RENO-SCALE-1/Back-end/Routes/API/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    const result = await response.json();

    if (!response.ok || result.status !== 'success') {
      document.getElementById('message').textContent = result.message || "Erreur lors de la connexion.";
      return;
    }

    // Étape 2 : récupération du rôle via dashboard.php
    const roleResponse = await fetch('http://web/RENO-SCALE-1/Back-end/Routes/API/dashboard.php', {
      method: 'GET',
      credentials: 'include'
    });

    const roleData = await roleResponse.json();

    if (roleData.status === 'success') {
      const role = roleData.role;

      // Étape 3 : redirection selon le rôle
      switch (role) {
        case 'admin':
          window.location.href = '../pages/pageadmin.html';
          break;
        case 'comptable':
          window.location.href = '../pages/comptable.html';
          break;
        case 'livreur':
          window.location.href = '../pages/livreur.html';
          break;
        case 'préparateur':
          window.location.href = '../pages/preparateur.html';
          break;
        case 'commercial':
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
