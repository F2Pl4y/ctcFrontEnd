window.esMapaEstatico = false;
document.addEventListener('DOMContentLoaded', function () {
    generarFormulario(); // Genera e inserta el formulario al cargar la página
});
function generarFormulario() {
    // Identificar el contenedor donde se insertará el formulario
    const contenedorFormulario = document.getElementById('formularioContainer');
    // const valortkn = sessionStorage.getItem("access_token");
    // const dataRuta = {
    //     mitkn: valortkn
    // };
    $.ajax({
        type: 'GET', // Ajusta este método según sea necesario para tu API
        url: `${dominio}/selVehic/`, // Asegúrate de que esta URL sea correcta para tu API
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
            let formularioHTML;
            // Crear el formulario y su contenido
            formularioHTML = `
            <form id="formCond">
                <div class="form-col">
                    <div class="col-md-12 mb-3">
                        <ul class="nav nav-tabs" id="myTabs" role="tablist">
                            <li class="nav-item"><a class="nav-link active" id="inicio-tab" data-toggle="tab" href="#inicio" role="tab" aria-controls="inicio" aria-selected="true">Punto de inicio</a></li>
                            <li class="nav-item"><a class="nav-link" id="llegada-tab" data-toggle="tab" href="#llegada" role="tab" aria-controls="llegada" aria-selected="false">Punto de Llegada</a></li>
                            <li class="nav-item"><a class="nav-link" id="horario-tab" data-toggle="tab" href="#horario" role="tab" aria-controls="horario" aria-selected="false">Horario del Viaje</a></li>
                            <li class="nav-item"><a class="nav-link" id="vehiculo-tab" data-toggle="tab" href="#vehiculo" role="tab" aria-controls="vehiculo" aria-selected="false">Detalle del Vehículo</a></li>
                        </ul>
                        <div class="tab-content" id="myTabsContent">
                            <div class="tab-pane fade show active" id="inicio" role="tabpanel" aria-labelledby="inicio-tab">
                                <div class="col-md-13 mb-3 containerGrid">
                                    <div class="txtUbicacion">
                                        <div class="col mb-3">
                                            <input type="text" class="form-control" placeholder="INICIO DEL VIAJE" id="autocomplete1" name="autocomplete1">
                                        </div>
                                    </div>
                                    <div class="txtDetalleUbi">
                                        <div class="col mb-3">
                                            <input type="text" class="form-control" placeholder="DETALLE" id="detalleInput1" required name="detalleInput1">
                                        </div>
                                    </div>
                                    <div class="divMapsG">
                                        <div id="map1" class=""></div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="llegada" role="tabpanel" aria-labelledby="llegada-tab">
                                <div class="containerGrid">
                                    <div class="txtUbicacion">
                                        <div class="col-md-12 mb-3">
                                            <input type="text" class="form-control" placeholder="LLEGADA DEL VIAJE" id="autocomplete2" name="autocomplete2">
                                        </div>
                                    </div>
                                    <div class="txtDetalleUbi">
                                        <div class="col-md-12 mb-3">
                                            <input type="text" class="form-control" placeholder="DETALLE" id="detalleInput2" required name="detalleInput2">
                                        </div>
                                    </div>
                                    <div class="divMapsG">
                                        <div id="map2"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="horario" role="tabpanel" aria-labelledby="horario-tab">
                                <div class="col mb-3">
                                    <div class="form-field">
                                        <input type="text" class="form-control checkin_date" placeholder="📅 FECHA DE PARTIDA" id="fechaPartidaInput" name="fechaPartidaInput" />
                                    </div>
                                </div>
                                <div class="col mb-3">
                                    <input type="text" id="horaSeleccionada" name="horaSeleccionada" class="form-control" data-toggle="modal" data-target="#staticBackdrop" readonly placeholder="SELECCIONAR HORARIO">
                                </div>
                            </div>
                            <div class="tab-pane fade" id="vehiculo" role="tabpanel" aria-labelledby="vehiculo-tab">
                                <div class="GridV">
                                    <div class="gridV1">
                                        <div class="col mb-3">
                                            <span>SELECCIONA TU VEHICULO</span>
                                            <div class="input-group-prepend">
                                                <select id="carSelect" class="custom-select custom-select-lg col">
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="gridV2">
                                        <div class="col mb-3">
                                            <span>ASIENTOS</span>
                                            <div class="input-group-prepend">
                                                <select id="asientosSelect" class="custom-select custom-select-lg ">
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="gridV3">
                                        <div class="col mb-3">
                                            <span>PRECIO POR PERSONA</span>
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text">S/.</span>
                                                </div>
                                                <input type="number" class="form-control" id="precio" name="precio" placeholder="" aria-describedby="precio-addon" step="any" pattern="\d+" min="0">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="gridV4">
                                        <span>METODO DE PAGO</span>
                                        <div class="row justify-content-center align-items-center">
                                            <div class="col mb-3" style="max-height: 8vh; max-width:10vh;">
                                                <div class="card seleccionable" data-valor="1" id="izquierda" style="width: 100%;">
                                                    <img src="https://seeklogo.com/images/Y/yape-logo-36579BE1F6-seeklogo.com.png" class="card-img-top" alt="Imagen Izquierda" style="height: 100%;">
                                                </div>
                                            </div>
                                            <div class="col mb-3" style="max-height: 8vh; max-width:10vh;">
                                                <div class="card seleccionable" data-valor="2" id="derecha" style="width: 100%;">
                                                    <img src="https://seeklogo.com/images/P/plin-logo-967A4AF583-seeklogo.com.png" class="card-img-top" alt="Imagen Derecha" style="height: 100%;">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button id="btnPublicar" class="btn btn-primary form-control" type="submit" style="display: none;">publicar viaje</button>
                    </div>
                </div>
            </form>`;
            // Insertar el formulario en el contenedor
            contenedorFormulario.innerHTML = formularioHTML;
            // Ahora que tienes definido formularioHTML, puedes usarlo en .replace()
            if (response.exito && response.resultado.length > 0) {
                const opcionesVehiculos = response.resultado.map(function (vehiculo) {
                    // return `<option value="${vehiculo.placa}" data-asientos="${vehiculo.asientos}">${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}</option>`;
                    return `<option value="${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}" data-asientos="${vehiculo.asientos}">${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}</option>`;
                }).join('');
                // Reemplaza el marcador de posición con las opciones reales
                formularioHTML = formularioHTML.replace(
                    '<select id="carSelect" class="custom-select custom-select-lg col">',
                    `<select id="carSelect" class="custom-select custom-select-lg col">${opcionesVehiculos}</select>`
                );
                // Insertar el formulario en el contenedor
                contenedorFormulario.innerHTML = formularioHTML;
                // Ahora que el select de vehículos está en el DOM, configura las opciones y los event listeners
                const selectVehiculos = document.getElementById('carSelect');
                selectVehiculos.innerHTML = opcionesVehiculos; // Establece las opciones de vehículos
                selectVehiculos.addEventListener('change', function () {
                    updateSeatOptions(this);
                });
                // Llama a updateSeatOptions inmediatamente para inicializar las opciones de asientos
                updateSeatOptions(selectVehiculos);
            } else {
                console.log("No se recibieron datos para los vehículos o la llamada AJAX no fue exitosa.");
            }
            // Insertar el formulario en el contenedor con los datos dinámicos
            // contenedorFormulario.innerHTML = formularioHTML;
            initMaps(); // Llamada a la función para inicializar los mapas

            // Luego de insertar el formulario, añadir el eventListener al input 'horaSeleccionada'
            document.getElementById('horaSeleccionada').addEventListener('click', function () {
                $('#staticBackdrop').modal('show');
            });
            $('#fechaPartidaInput').datepicker({
                format: "dd/mm/yyyy",
                startDate: "today",
                autoclose: true,
                todayHighlight: true,
                language: 'es' // Especifica el idioma español
            });
            // Luego de insertar el formulario, puedes inicializar componentes o agregar listeners si es necesario
            // Asegúrate de que el botón 'publicar' exista antes de añadirle un event listener
            const btnPublicar = document.getElementById('btnPublicar');
            if (btnPublicar) {
                btnPublicar.addEventListener('click', function (e) {
                    e.preventDefault();
                    grabarForm();
                });
            }
            // Inicializar cualquier otro componente o añadir event listeners adicionales aquí
            verificarCampos(); // Asegúrate de llamar a verificar Campos para inicializar el estado del botón 'publicar'
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error al cargar el detalle del viaje", textStatus, errorThrown, jqXHR);
            // Manejar adecuadamente el error
        }
    });
}
function updateSeatOptions(vehicleSelect) {
    const numAsientos = vehicleSelect.options[vehicleSelect.selectedIndex].getAttribute('data-asientos');
    const asientosSelect = document.getElementById('asientosSelect');
    asientosSelect.innerHTML = ''; // Limpiar opciones existentes
    for (let i = 1; i <= numAsientos; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        asientosSelect.appendChild(option);
    }
}
function grabarForm() {
    // Obtener el token del sessionStorage
    const token = sessionStorage.getItem("access_token");
    if (!token) {
        console.log("No se encontró el token");
        return;
    }
    var autocomplete1 = $('#autocomplete1').val();
    var detalleInput1 = $('#detalleInput1').val();
    var autocomplete2 = $('#autocomplete2').val();
    var detalleInput2 = $('#detalleInput2').val();
    var fechaPartidaInput = $('#fechaPartidaInput').val();
    var horaSeleccionada = $('#horaSeleccionada').val();
    var carSelect = document.getElementById('carSelect').value;
    // var asientosSelect = document.querySelector('.custom-select-lg:last-child').value;
    var asientosSelect = document.getElementById('asientosSelect').value;
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
                console.log("mi response: mensaje:", response["mensaje"]);
                // alert("se guardo");
                // window.location.href = 'inicio.html';
                // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
            } else {
                console.log("Hubo un problema con la respuesta del servidor.");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("jqXHR status:", jqXHR.status, "\njqXHR responseText:", jqXHR.responseText, "\ntextStatus:", textStatus, "\nerrorThrown:", errorThrown);
        }
    });
}
// Llamar a verificarCampos() cada vez que se realice un cambio relevante en el formulario
$(document).on('input change', '#autocomplete1, #detalleInput1, #autocomplete2, #detalleInput2, #precio, #fechaPartidaInput, #horaSeleccionada, #carSelect, #asientosSelect', verificarCampos);
$(document).on('click', '.seleccionable', function () {
    // Marcar como seleccionado y llamar a verificarCampos()
    $('.seleccionable').removeClass('seleccionada');
    $(this).addClass('seleccionada');
    verificarCampos(); // Esta llamada asegura que el botón se muestre/oculte adecuadamente al seleccionar un método de pago
    // Ejemplo de cómo se podría llamar después de seleccionar la hora en el modal
    $('#staticBackdrop').on('hide.bs.modal', function () {
        verificarCampos(); // Verifica los campos cuando el modal se cierra
    });
});
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
function initMaps() {
    import('./prueba.js').then((module) => {
        if (document.getElementById('map1') && document.getElementById('autocomplete1')) {
            module.initMap('map1', 'autocomplete1').then(() => {
            }).catch(error => {
                console.error('Error inicializando el mapa 1:', error);
            });
        }
        if (document.getElementById('map2') && document.getElementById('autocomplete2')) {
            module.initMap('map2', 'autocomplete2').then(() => {
            }).catch(error => {
                console.error('Error inicializando el mapa 2:', error);
            });
        }
    });
}
import { dominio } from '../js/validador.js';