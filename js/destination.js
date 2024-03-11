moment.locale('es');
document.addEventListener('DOMContentLoaded', function () {
    accInsViaj();
});
function accInsViaj() {
    const btnPublicar = document.getElementById('btnBuscar');
    btnPublicar.addEventListener('click', function (e) {
        e.preventDefault();
        buscarForm();
    });
}
function buscarForm() {
    // Obtener el token del sessionStorage
    const token = sessionStorage.getItem("access_token");
    console.log("valor del token", token);
    if (!token) {
        console.log("No se encontró el token en el sessionStorage. Asegúrate de estar logueado.");
        return; // Detiene la ejecución si no hay token
    }
    var iptOrigen = $('#iptOrigen').val();
    var iptDestino = $('#iptDestino').val();
    var iptFecha = $('#iptFecha').val();
    const dataRuta = {
        jsonOrigen: iptOrigen,
        jsonDestino: iptDestino,
        jsonFecha: iptFecha,
        mitkn: token
    };
    console.log(dataRuta);
    $.ajax({
        type: 'POST',
        url: `${dominio}/selViaje/`,
        data: JSON.stringify(dataRuta),
        dataType: 'json',
        contentType: 'application/json',
        // Incluir el token en el encabezado Authorization
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (response) {
            // Convierte response.mensaje en un array si no lo es
            var mensajes = Array.isArray(response.mensaje) ? response.mensaje : [response.mensaje];
            console.log("ENTRASTE A RESPONSE");
            // if (response["mensaje"]) {
            if (Array.isArray(response.mensaje) && response.mensaje.length > 0) {
                // Obtener la fecha del input
                var iptFecha = $('#iptFecha').val();
                console.log("iptFecha:", iptFecha);
                // Formatear la fecha para el encabezado de la tabla
                if (iptFecha) {
                    var fechaFormateada = moment(iptFecha, "MM/DD/YYYY").format('dddd: D [de] MMMM'); // Cambia el formato aquí según necesites
                    $('#fechaSeleccionada').text(fechaFormateada);
                }
                console.log("correctooooooo", response["mensaje"]);
                // Limpiar el tbody para asegurar que no se dupliquen los datos
                $('#tablePrec1 tbody').empty();
                // Iterar sobre cada elemento del array de mensajes y crear las filas de la tabla
                // response["mensaje"].forEach(function (item, index) {
                mensajes.forEach(function (item, index) {
                    var horaFormateada = formatoHora(item.hora);
                    var fila = `<tr>
                    <th scope="row">${index + 1}</th>
                    <td>${recortarTexto(item.inicioViaje, 24)}</td>
                    <td>${recortarTexto(item.finViaje, 24)}</td>
                    <td>${horaFormateada}</td>
                    <td>${item.costo}</td>
                    <td>
                      <center>
                        ${item.asientos}
                      </center>
                    </td>
                    <td><button type="button" class="btn btn-success btn-elegir" data-id="${item.viajeID}">Elegir</button></td>
                </tr>`;
                    $('#tablePrec1 tbody').append(fila);
                });
                // Añade el listener aquí para que se aplique a los botones generados dinámicamente
                $('.btn-elegir').on('click', function () {
                    // Aquí puedes hacer cosas antes de mostrar el modal, como configurar su contenido basado en el botón que fue presionado
                    // Por ejemplo, puedes usar $(this).data('id') para obtener el identificador asociado con el botón y usarlo para buscar más información
                    $('#miModal').modal('show'); // Muestra el modal
                });
                generarBotonesYMostrarFilas("tablePrec1", 0);
            } else {
                var iptFecha = $('#iptFecha').val();
                console.log("iptFecha:", iptFecha);
                // Formatear la fecha para el encabezado de la tabla
                if (iptFecha) {
                    var fechaFormateada = moment(iptFecha, "MM/DD/YYYY").format('dddd: D [de] MMMM'); // Cambia el formato aquí según necesites
                    $('#fechaSeleccionada').text(fechaFormateada);
                }
                $('#tablePrec1 tbody').empty();
                // Aquí puedes optar por mostrar un mensaje en la tabla indicando que no se encontraron datos
                var filaVacia = `<tr><td colspan="7" class="text-center">No se encontraron datos para la búsqueda realizada.</td></tr>`;
                $('#tablePrec1 tbody').append(filaVacia);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("ENTRASTE AL ERROR")
            console.log("jqXHR status:", jqXHR.status);
            console.log("jqXHR responseText:", jqXHR.responseText);
            console.log("textStatus:", textStatus);
            console.log("errorThrown:", errorThrown);
        }
    });
}

function formatoHora(fechaHoraGMT) {
    // Extraer la hora y los minutos directamente de la cadena
    const partes = fechaHoraGMT.match(/(\d{2}):(\d{2}):(\d{2})/);
    let horas = parseInt(partes[1], 10);
    let minutos = partes[2];

    // Determinar AM o PM
    const ampm = horas >= 12 ? 'pm' : 'am';

    // Convertir el formato de 24h a 12h
    horas = horas % 12;
    horas = horas ? horas : 12; // El operador ternario maneja el caso de horas = 0

    // Construir la cadena de tiempo formateada
    const tiempoFormateado = horas + ':' + minutos + ' ' + ampm;

    return tiempoFormateado;
}

function recortarTexto(texto, longitudMax) {
    if (texto.length > longitudMax) {
        return texto.substring(0, longitudMax) + '...';
    } else {
        return texto;
    }
}













import { dominio } from '../js/validador.js';