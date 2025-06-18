document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("eventModal");
  const closeModal = document.getElementById("closeModal");
  const form = document.getElementById("eventForm");
  const dayColumns = document.querySelector(".day-columns");
  const monthLabel = document.querySelector(".month-label");
  const navButtons = document.querySelectorAll(".nav-btn");

  let editingEvent = null;
  let events = []; 
  
  
  let currentWeekStartDate = getStartOfWeek(new Date());

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1 - day); 
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function formatDateLabel(date) {
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  }

  function generateAgendaCells() {
    dayColumns.innerHTML = "";
    for (let day = 0; day < 7; day++) {
      for (let hour = 8; hour <= 16; hour++) {
        const cell = document.createElement("div");
        cell.classList.add("agenda-cell");

        const currentDate = new Date(currentWeekStartDate);
        currentDate.setDate(currentDate.getDate() + day);
        cell.dataset.day = (currentDate.getDay() === 0 ? 7 : currentDate.getDay());
        cell.dataset.hour = hour;
        cell.dataset.date = currentDate.toISOString().split("T")[0];
        dayColumns.appendChild(cell);
      }
    }
  }

  function updateMonthLabel() {
    monthLabel.textContent = formatDateLabel(currentWeekStartDate);
  }

  // Double-clic sur cellule vide
  dayColumns.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("agenda-cell")) {
      editingEvent = null;
      form.reset();

      document.getElementById("eventDate").value = e.target.dataset.date;
      document.getElementById("eventTime").value = `${String(e.target.dataset.hour).padStart(2, '0')}:00`;

      document.getElementById("modalTitle").textContent = "Ajouter un événement";
      modal.classList.remove("hidden");
    }
  });

  // Clic sur un événement
  dayColumns.addEventListener("click", (e) => {
    if (e.target.classList.contains("event") || e.target.closest(".event")) {
      editingEvent = e.target.closest(".event");

      const parentCell = editingEvent.parentElement;
      const date = parentCell.dataset.date;
      const hour = parentCell.dataset.hour;
      const desc = editingEvent.textContent;

      document.getElementById("eventDate").value = date;
      document.getElementById("eventTime").value = `${String(hour).padStart(2, '0')}:00`;
      document.getElementById("eventDesc").value = desc;

      document.getElementById("modalTitle").textContent = "Modifier l’événement";
      modal.classList.remove("hidden");
    }
  });

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    editingEvent = null;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const desc = document.getElementById("eventDesc").value;

    const hour = parseInt(time.split(":")[0]);

    if (editingEvent) {
      editingEvent.remove();
    }

    createEvent(date, hour, desc);

    form.reset();
    modal.classList.add("hidden");
    editingEvent = null;
  });

  function createEvent(dateStr, hour, description) {
    const targetCell = [...document.querySelectorAll(".agenda-cell")].find(cell =>
      cell.dataset.date === dateStr && parseInt(cell.dataset.hour) === hour
    );

    if (targetCell) {
      const event = document.createElement("div");
      event.classList.add("event");
      event.innerHTML = `<strong>${description}</strong>`;
      targetCell.appendChild(event);
    }
  }

  // Supprimer un événement
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Supprimer";
  deleteBtn.type = "button";
  deleteBtn.className = "agenda-btn delete-btn";
  form.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", () => {
    if (editingEvent) {
      editingEvent.remove();
      form.reset();
      modal.classList.add("hidden");
      editingEvent = null;
    }
  });

  // Navigation semaine suivante / précédente
  navButtons[0].addEventListener("click", () => {
    currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
    updateWeekView();
  });

  navButtons[1].addEventListener("click", () => {
    currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
    updateWeekView();
  });

  function updateWeekView() {
    generateAgendaCells();
    updateMonthLabel();
  }


  document.querySelector(".today-btn").addEventListener("click", () => {
    currentWeekStartDate = getStartOfWeek(new Date());
    updateWeekView();
    alert(`Aujourd'hui : ${new Date().toLocaleDateString("fr-FR")}`);
  });

  // Initialisation
  updateWeekView();
});
