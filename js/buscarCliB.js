window.esMapaEstatico = false;
document.addEventListener('DOMContentLoaded', function () {
    accInsViaj();
    initMaps(); // Llamada a la función para inicializar los mapas
});
function accInsViaj() {
    const btnPublicar = document.getElementById('btnPublicar');
    btnPublicar.addEventListener('click', function (e) {
        e.preventDefault();
        grabarForm();
    });
}
function grabarForm() {
    // Obtener el token del sessionStorage
    const token = sessionStorage.getItem("access_token");
    console.log("valor del token", token);
    if (!token) {
        console.log("No se encontró el token en el sessionStorage. Asegúrate de estar logueado.");
        return; // Detiene la ejecución si no hay token
    }
    var autocomplete1 = $('#autocomplete1').val();
    var detalleInput1 = $('#detalleInput1').val();
    var autocomplete2 = $('#autocomplete2').val();
    var detalleInput2 = $('#detalleInput2').val();
    var fechaPartidaInput = $('#fechaPartidaInput').val();
    var horaSeleccionada = $('#horaSeleccionada').val();
    var carSelect = document.getElementById('carSelect').value;
    var asientosSelect = document.querySelector('.custom-select-lg:last-child').value;
    var precio = $('#precio').val();
    var metodoPago = $('.seleccionada').data('valor');
    const dataCarrera = {
        viajeA: autocomplete1,
        detViajeA: detalleInput1,
        viajeB: autocomplete2,
        detViajeB: detalleInput2,
        datePart: fechaPartidaInput,
        timePart: horaSeleccionada,
        carSel: carSelect,
        asiCant: asientosSelect,
        costPasaje: precio,
        pagoType: metodoPago,
        mitkn: token
    };
    console.log(dataCarrera);
    console.log("VALOR DE LA RUTA");
    console.log(`${dominio}/regViaje/`);
    $.ajax({
        type: 'POST',
        url: `${dominio}/regViaje/`,
        data: JSON.stringify(dataCarrera),
        dataType: 'json',
        contentType: 'application/json',
        // Incluir el token en el encabezado Authorization
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        },
        success: function (response) {
            if (response["mensaje"]) {
                console.log("correctooooooo", response["mensaje"]);
                // alert("se guardo");
                // window.location.href = 'inicio.html';
                // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
            } else {
                console.log("Hubo un problema con la respuesta del servidor.");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("jqXHR status:", jqXHR.status);
            console.log("jqXHR responseText:", jqXHR.responseText);
            console.log("textStatus:", textStatus);
            console.log("errorThrown:", errorThrown);
            // window.location.href = 'buscarCliB.html';
            // alert("PROBLEMAS");
            // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
        }
    });
}
// Llamar a verificarCampos() cada vez que se realice un cambio en cualquiera de los inputs o selects
$('#autocomplete1, #detalleInput1, #autocomplete2, #detalleInput2, #fechaPartidaInput, #horaSeleccionada, #carSelect, #asientosSelect, #precio').change(verificarCampos);
$('.seleccionable').click(verificarCampos); // Asumiendo que .seleccionable es la clase para los métodos de pago
function verificarCampos() {
    var autocomplete1 = $('#autocomplete1').val();
    var detalleInput1 = $('#detalleInput1').val();
    var autocomplete2 = $('#autocomplete2').val();
    var detalleInput2 = $('#detalleInput2').val();
    var fechaPartidaInput = $('#fechaPartidaInput').val();
    var horaSeleccionada = $('#horaSeleccionada').val();
    var carSelect = $('#carSelect').val();
    var asientosSelect = $('#asientosSelect').val();
    var precio = $('#precio').val();
    var metodoPago = $('.seleccionada').data('valor');

    var camposValidos = autocomplete1 && detalleInput1 && autocomplete2 && detalleInput2 && fechaPartidaInput &&
        horaSeleccionada && carSelect && asientosSelect && precio && metodoPago !== undefined;

    $('#btnPublicar').css('display', camposValidos ? 'block' : 'none');
    return camposValidos; // Retorna el estado de la validación
}
// $.ajax({
//     type: 'POST',
//     url: `${dominio}/regViaje/`,
//     data: JSON.stringify(dataCarrera),
//     dataType: 'json',
//     contentType: 'application/json',
//     success: function (response) {
//         if (response["mensaje"]) {
//             console.log("correctooooooo");
//         } else {
//             console.log("Hubo un problema");
//         }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//         // console.log("Error en la solicitud AJAX");
//         console.log("jqXHR status:", jqXHR.status);
//         console.log("jqXHR responseText:", jqXHR.responseText);
//         console.log("textStatus:", textStatus);
//         console.log("errorThrown:", errorThrown);
//     }
// });

// Definir la función que inicializa ambos mapas
function initMaps() {
    // Asegúrate de que esta ruta de importación coincide con la ubicación de tus archivos y funciones
    import('./prueba.js').then((module) => {
        module.initMap('map1', 'autocomplete1').then(() => {
            console.log('Mapa 1 inicializado correctamente');
        }).catch(error => {
            console.error('Error inicializando el mapa 1:', error);
        });

        module.initMap('map2', 'autocomplete2').then(() => {
            console.log('Mapa 2 inicializado correctamente');
        }).catch(error => {
            console.error('Error inicializando el mapa 2:', error);
        });
    });
}


import { dominio } from '../js/validador.js';