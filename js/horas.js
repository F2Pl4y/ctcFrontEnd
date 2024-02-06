// Función para seleccionar la hora y actualizar el valor del input
function seleccionarHora(hora) {
    document.getElementById("horaSeleccionada").value = hora;
    // Cerrar el modal
    $('#staticBackdrop').modal('hide');
}

// Asignar la función al evento shown.bs.modal para que se ejecute después de que el modal se muestre
$('#staticBackdrop').on('shown.bs.modal', function () {
    generarHoras();
});

// Abrir el modal al hacer clic en el input
document.getElementById('horaSeleccionada').addEventListener('click', function () {
    $('#staticBackdrop').modal('show');
});

// Asignar la función al evento hidden.bs.modal para capturar el valor después de cerrar el modal
$('#staticBackdrop').on('hidden.bs.modal', function () {
    // Capturar el valor después de cerrar el modal
    var horaSeleccionadaValor = document.getElementById("horaSeleccionada").value;

    // // Muestra el valor en la consola
    // console.log('Hora Seleccionada después de cerrar el modal:', horaSeleccionadaValor);
});
// Función para generar las horas en intervalos de 15 minutos y dividirlas en 4 columnas
function generarHoras() {
    var modalColumna1 = document.getElementById("modalColumna1");
    var modalColumna2 = document.getElementById("modalColumna2");
    var modalColumna3 = document.getElementById("modalColumna3");
    var modalColumna4 = document.getElementById("modalColumna4");

    // Limpiar el contenido existente
    modalColumna1.innerHTML = "";
    modalColumna2.innerHTML = "";
    modalColumna3.innerHTML = "";
    modalColumna4.innerHTML = "";

    // Hora de inicio
    var horaInicio = new Date();
    horaInicio.setHours(0, 0, 0, 0);

    // Intervalo de tiempo en minutos
    var intervalo = 15;

    // Generar las horas y agregarlas a las columnas en el modal
    for (var i = 0; i < 24 * 60 / intervalo; i++) {
        var hora = new Date(horaInicio.getTime() + i * intervalo * 60000);
        var horaFormateada = hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Agregar "AM" o "PM"
        var ampm = hora.getHours() >= 12 ? "PM" : "AM";
        horaFormateada += " " + ampm;

        // Crear un nuevo enlace
        var enlace = document.createElement("a");
        enlace.classList.add("dropdown-item");
        // enlace.href = "#";
        enlace.textContent = horaFormateada;

        // Agregar evento onclick para seleccionar la hora
        enlace.onclick = (function (horaSeleccionada) {
            return function () {
                seleccionarHora(horaSeleccionada);
            };
        })(horaFormateada);

        // Calcular la columna actual
        var columnaActual = i % 4;

        // Agregar el enlace a la columna correspondiente en el modal
        if (columnaActual === 0) {
            modalColumna1.appendChild(enlace);
        } else if (columnaActual === 1) {
            modalColumna2.appendChild(enlace);
        } else if (columnaActual === 2) {
            modalColumna3.appendChild(enlace);
        } else {
            modalColumna4.appendChild(enlace);
        }
    }
}

// Asignar la función al evento shown.bs.modal para que se ejecute después de que el modal se muestre
$('#staticBackdrop').on('shown.bs.modal', function () {
    generarHoras();
});
