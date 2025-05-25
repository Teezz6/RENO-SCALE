document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".sidebar ul li a");

  links.forEach(link => {
    link.addEventListener("click", function () {
      // Enlève la classe active de tous les liens
      links.forEach(l => l.classList.remove("active"));
      // Ajoute la classe active sur le lien cliqué
      this.classList.add("active");
      // Le défilement se fait naturellement via href="#id"
    });
  });
});
