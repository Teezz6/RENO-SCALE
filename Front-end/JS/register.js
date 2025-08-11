document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('http://web/RENO-SCALE-1/Back-end/Routes/API/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    document.getElementById('message').textContent = result.message;

    if (response.ok) {
      alert("Inscription réussie !");
    }

  } catch (error) {
    document.getElementById('message').textContent = "Erreur lors de l'inscription.";
    console.error(error);
  }
});