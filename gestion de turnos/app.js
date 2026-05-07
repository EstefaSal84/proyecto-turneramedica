async function cargarTurnos() {
  const response = await fetch("turnos.json");
  return await response.json();
}

function mostrarTurnos(turnos) {
  const lista = document.getElementById("listaTurnos");
  lista.innerHTML = "";

  turnos.forEach(t => {
    const item = document.createElement("li");
    item.textContent = `${t.hora} - ${t.disponible ? "Disponible" : "Ocupado"}`;
    item.classList.add(t.disponible ? "disponible" : "ocupado");
    item.addEventListener("click", () => reservarTurno(t));
    lista.appendChild(item);
  });
}

function reservarTurno(turno) {
  if (turno.disponible) {
    turno.disponible = false;
    Toastify({
      text: "Turno reservado con éxito",
      duration: 3000,
      backgroundColor: "green"
    }).showToast();
    mostrarTurnos(turnosSeleccionados);
  } else {
    Toastify({
      text: "Turno no disponible",
      duration: 3000,
      backgroundColor: "red"
    }).showToast();
    Swal.fire({
      title: "Turno ocupado",
      text: "¿Deseas elegir otro horario?",
      icon: "error"
    });
  }
}

let datos = [];
let turnosSeleccionados = [];

cargarTurnos().then(data => {
  datos = data;

  const inputFecha = document.getElementById("fecha");

  // Inicializar con la fecha de hoy si existe en el JSON
  const hoy = new Date().toISOString().split("T")[0];
  inputFecha.value = hoy;

  const diaHoy = datos.find(d => d.fecha === hoy);
  if (diaHoy) {
    turnosSeleccionados = diaHoy.turnos;
    mostrarTurnos(turnosSeleccionados);
  } else {
    document.getElementById("listaTurnos").innerHTML =
      "<li>No hay turnos para la fecha de hoy</li>";
  }

  // Evento para cuando el usuario cambia la fecha
  inputFecha.addEventListener("change", () => {
    const seleccion = inputFecha.value;
    const dia = datos.find(d => d.fecha === seleccion);
    if (dia) {
      turnosSeleccionados = dia.turnos;
      mostrarTurnos(turnosSeleccionados);
    } else {
      document.getElementById("listaTurnos").innerHTML =
        "<li>No hay turnos para esta fecha</li>";
    }
  });
});

