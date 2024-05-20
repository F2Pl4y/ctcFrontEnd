moment.locale('es');
function misViajesActive() {
    // const contenedorFormulario = document.getElementById('formularioContainer');
    // const valortkn = sessionStorage.getItem("access_token");
    // const dataRuta = {
    //     mitkn: valortkn
    // };
    $.ajax({
        type: 'GET', // Ajusta este método según sea necesario para tu API
        url: `${dominio}/selViaUserAct/`, // Asegúrate de que esta URL sea correcta para tu API
        // data: JSON.stringify(dataRuta),
        // dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            const token = sessionStorage.getItem("access_token");
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        },
        success: function (response) {
            var mensajes = Array.isArray(response.resultado) ? response.resultado : [response.resultado];
            console.log("valores de mensajes:", mensajes);
            if (Array.isArray(response.resultado) && response.resultado.length > 0) {
                // Obtener la fecha del input
                var iptFecha = $('#iptFecha').val();
                // console.log("iptFecha:", iptFecha);
                // Formatear la fecha para el encabezado de la tabla
                if (iptFecha) {
                    var fechaFormateada = moment(iptFecha, "MM/DD/YYYY").format('dddd: D [de] MMMM'); // Cambia el formato aquí según necesites
                    $('#fechaSeleccionada').text(fechaFormateada);
                }
                // console.log("correctooooooo", response["mensaje"]);
                // Limpiar el tbody para asegurar que no se dupliquen los datos
                $('#tablePrec2 tbody').empty();
                // Iterar sobre cada elemento del array de mensajes y crear las filas de la tabla
                // response["mensaje"].forEach(function (item, index) {
                mensajes.forEach(function (item, index) {
                    var horaFormateada = formatoHora(item.fechaPart);
                    var fila = `<tr>
                            <th scope="row">${index + 1}</th>
                            <td>${recortarTexto(item.inicio, 24)}</td>
                            <td>${recortarTexto(item.final, 24)}</td>
                            <td>${horaFormateada}</td>
                            <td>${item.monto}</td>
                        </tr>`;
                    $('#tablePrec2 tbody').append(fila);
                });
                generarBotonesYMostrarFilas("tablePrec2", 0);
            }
            else {
                var iptFecha = $('#iptFecha').val();
                console.log("iptFecha:", iptFecha);
                // Formatear la fecha para el encabezado de la tabla
                if (iptFecha) {
                    var fechaFormateada = moment(iptFecha, "MM/DD/YYYY").format('dddd: D [de] MMMM'); // Cambia el formato aquí según necesites
                    $('#fechaSeleccionada').text(fechaFormateada);
                }
                $('#tablePrec2 tbody').empty();
                // Aquí puedes optar por mostrar un mensaje en la tabla indicando que no se encontraron datos
                var filaVacia = `<tr><td colspan="7" class="text-center">No se encontraron datos para la búsqueda realizada.</td></tr>`;
                $('#tablePrec2 tbody').append(filaVacia);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error al cargar el detalle del viaje", textStatus, errorThrown, jqXHR);
            // Manejar adecuadamente el error <td>${formatoHora2(viaje.fechaPart)}</td>
        }
    });
}
function misViajesInactive() {
    // const contenedorFormulario = document.getElementById('formularioContainer');
    // const valortkn = sessionStorage.getItem("access_token");
    // const dataRuta = {
    //     mitkn: valortkn
    // };
    $.ajax({
        type: 'GET', // Ajusta este método según sea necesario para tu API
        url: `${dominio}/selViaUserIna/`, // Asegúrate de que esta URL sea correcta para tu API
        // data: JSON.stringify(dataRuta),
        // dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (xhr) {
            const token = sessionStorage.getItem("access_token");
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        },
        success: function (response) {
            var mensajes = Array.isArray(response.resultado) ? response.resultado : [response.resultado];
            console.log("valores de mensajes:", mensajes);
            if (Array.isArray(response.resultado) && response.resultado.length > 0) {
                // Obtener la fecha del input
                var iptFecha = $('#iptFecha').val();
                // console.log("iptFecha:", iptFecha);
                // Formatear la fecha para el encabezado de la tabla
                if (iptFecha) {
                    var fechaFormateada = moment(iptFecha, "MM/DD/YYYY").format('dddd: D [de] MMMM'); // Cambia el formato aquí según necesites
                    $('#fechaSeleccionada').text(fechaFormateada);
                }
                // console.log("correctooooooo", response["mensaje"]);
                // Limpiar el tbody para asegurar que no se dupliquen los datos
                $('#tablePrec1 tbody').empty();
                // Iterar sobre cada elemento del array de mensajes y crear las filas de la tabla
                // response["mensaje"].forEach(function (item, index) {
                mensajes.forEach(function (item, index) {
                    var horaFormateada = formatoHora(item.fechaPart);
                    var fila = `<tr>
                            <th scope="row">${index + 1}</th>
                            <td>${recortarTexto(item.inicio, 24)}</td>
                            <td>${recortarTexto(item.final, 24)}</td>
                            <td>${horaFormateada}</td>
                            <td>${item.monto}</td>
                        </tr>`;
                    $('#tablePrec1 tbody').append(fila);
                });
                generarBotonesYMostrarFilas("tablePrec1", 0);
            }
            else {
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
            console.log("Error al cargar el detalle del viaje", textStatus, errorThrown, jqXHR);
            // Manejar adecuadamente el error <td>${formatoHora2(viaje.fechaPart)}</td>
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    misViajesActive();
    misViajesInactive();
    // generarFormulario(); // Genera e inserta el formulario al cargar la página
});
function recortarTexto(texto, longitudMax) {
    if (texto.length > longitudMax) {
        return texto.substring(0, longitudMax) + '...';
    } else {
        return texto;
    }
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
function formatoHora2(fechaHoraGMT) {
    // Crea un objeto moment con la fecha en GMT
    let fechaMoment = moment(fechaHoraGMT, 'ddd, DD MMM YYYY HH:mm:ss GMT');
    // Formatea la fecha al estilo español
    let fechaFormateada = fechaMoment.format('dddd D [de] MMMM, h:mm a'); // 'a' es para AM/PM
    return fechaFormateada;
}
import { dominio } from '../js/validador.js';