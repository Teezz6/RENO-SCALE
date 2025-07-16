document.addEventListener("DOMContentLoaded", () => {
  // Simulation des données récupérées du back
  const user = {
    nom: "Ndong",
    prenom: "Rosalba",
    email: "rosalba@fashionchic.fr",
    role: "Responsable Stock",
    photo: "", 
  };

 
  document.getElementById("nomPrenom").textContent = `${user.prenom} ${user.nom}`;
  document.getElementById("email").textContent = user.email;
  document.getElementById("role").textContent = user.role;


  const avatar = document.querySelector(".avatar");
  if (user.photo) {
    avatar.src = user.photo;
  } else {
    const seed = Math.random().toString(36).substring(2, 10); 
    avatar.src = `https://api.dicebear.com/8.x/avataaars/svg?seed=${seed}`;
  }

  
  const citations = [
    "“Le style est une manière de dire qui vous êtes sans parler.” – Rachel Zoe",
    "“L’élégance est la seule beauté qui ne se fane jamais.” – Audrey Hepburn",
    "“La mode passe, le style reste.” – Coco Chanel",
    "“La créativité, c’est l’intelligence qui s’amuse.” – Albert Einstein",
    "“Fais de ta vie un rêve, et d’un rêve, une réalité.” – Saint-Exupéry"
  ];

  const citationElement = document.getElementById("citation");
  citationElement.textContent = citations[Math.floor(Math.random() * citations.length)];
});
