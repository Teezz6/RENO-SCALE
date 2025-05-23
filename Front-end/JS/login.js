document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const data = {
    email,
    mot_passe: password
  };

  try {
    const response = await fetch('http://web/RENO-SCALE-1/Back-end/Routes/API/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById('loginMessage').textContent = result.message;

    if (response.ok) {
      alert("Connexion réussie !");
    }

  } catch (error) {
    document.getElementById('loginMessage').textContent = "Erreur lors de la connexion.";
    console.error(error);
  }
});
