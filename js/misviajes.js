generarBotonesYMostrarFilas("tablePrec1", 0);
generarBotonesYMostrarFilas("tablePrec2", 0);
function misViajesActive() {
    const contenedorFormulario = document.getElementById('formularioContainer');
    // const valortkn = sessionStorage.getItem("access_token");
    // const dataRuta = {
    //     mitkn: valortkn
    // };
    $.ajax({
        type: 'GET', // Ajusta este método según sea necesario para tu API
        url: `${dominio}/---/`, // Asegúrate de que esta URL sea correcta para tu API
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
            <div class="row d-flex table-responsive">
                <table class="table tablePrec2 thead-dark" id="tablePrec2">
                    <thead>
                        <tr class="thead-dark">
                            <th colspan="12" scope="col mx-auto">VIAJES ACTIVOS</th>
                        </tr>
                        <tr class="table table-secondary">
                            <th scope="col mx-auto">#</th>
                            <th scope="col mx-auto">PARTIDA</th>
                            <th scope="col mx-auto">LLEGADA</th>
                            <th scope="col mx-auto">HORA DE PARTIDA</th>
                            <th scope="col mx-auto">HORA DE LLEGADA</th>
                            <th scope="col mx-auto">FECHA</th>
                            <th scope="col mx-auto">COSTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Lima</td>
                            <td>Arequipa</td>
                            <td>07:45 am</td>
                            <td>01:30 pm</td>
                            <td>12/13/2023</td>
                            <td>65.0</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Arequipa</td>
                            <td>Cusco</td>
                            <td>10:15 am</td>
                            <td>03:45 pm</td>
                            <td>12/13/2023</td>
                            <td>78.2</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Lima</td>
                            <td>Trujillo</td>
                            <td>08:30 am</td>
                            <td>12:30 pm</td>
                            <td>12/13/2023</td>
                            <td>55.5</td>
                        </tr>
                        <tr>
                            <th scope="row">4</th>
                            <td>Arequipa</td>
                            <td>Puno</td>
                            <td>09:00 am</td>
                            <td>02:15 pm</td>
                            <td>12/13/2023</td>
                            <td>70.8</td>
                        </tr>
                        <tr>
                            <th scope="row">5</th>
                            <td>Lima</td>
                            <td>Ica</td>
                            <td>07:00 am</td>
                            <td>11:00 am</td>
                            <td>12/13/2023</td>
                            <td>50.2</td>
                        </tr>
                        <tr>
                            <th scope="row">6</th>
                            <td>Cusco</td>
                            <td>Puno</td>
                            <td>11:30 am</td>
                            <td>04:45 pm</td>
                            <td>12/13/2023</td>
                            <td>85.5</td>
                        </tr>
                        <tr>
                            <th scope="row">7</th>
                            <td>Trujillo</td>
                            <td>Chiclayo</td>
                            <td>01:15 pm</td>
                            <td>05:30 pm</td>
                            <td>12/13/2023</td>
                            <td>62.3</td>
                        </tr>
                        <tr>
                            <th scope="row">8</th>
                            <td>Lima</td>
                            <td>Pisco</td>
                            <td>09:45 am</td>
                            <td>02:00 pm</td>
                            <td>12/13/2023</td>
                            <td>68.7</td>
                        </tr>
                        <tr>
                            <th scope="row">9</th>
                            <td>Arequipa</td>
                            <td>Nazca</td>
                            <td>10:30 am</td>
                            <td>03:15 pm</td>
                            <td>12/13/2023</td>
                            <td>75.4</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Botones de paginación se generarán dinámicamente aquí -->
                <div class="container">
                    <div class="row">
                        <div class="col text-center">
                            <div class="block-27">
                                <ul id="tablePrec2PaginationButtons"></ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
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
// import { dominio } from '../js/validador.js';