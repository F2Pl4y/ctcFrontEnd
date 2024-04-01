window.esMapaEstatico = true;
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
      // if (response["mensaje"]) {
      if (Array.isArray(response.mensaje) && response.mensaje.length > 0) {
        // Obtener la fecha del input
        var iptFecha = $('#iptFecha').val();
        // console.log("iptFecha:", iptFecha);
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
        // $('.btn-elegir').on('click', function () {
        //     var viajeID = $(this).data('id');
        //     cargar DetalleViaje(viajeID);
        //     // Aquí puedes hacer cosas antes de mostrar el modal, como configurar su contenido basado en el botón que fue presionado
        //     // Por ejemplo, puedes usar $(this).data('id') para obtener el identificador asociado con el botón y usarlo para buscar más información
        //     $('#miModal').modal('show'); // Muestra el modal
        // });
        generarBotonesYMostrarFilas("tablePrec1", 0);
        // $('#tablePrec1 tbody').on('click', '.btn-elegir', function () {
        //   var viajeID = $(this).data('id');
        //   cargarDetalleViaje(viajeID);
        //   $('#miModal').modal('show');
        // });
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
function cargarDetalleViaje(viajeID) {
  return new Promise((resolve, reject) => { // Envolver el contenido en una nueva Promesa
    $.ajax({
      type: 'GET', // Ajusta este método según sea necesario para tu API
      url: `${dominio}/detalleViaje/get/${viajeID}`, // Asegúrate de que esta URL sea correcta para tu API
      contentType: 'application/json',
      beforeSend: function (xhr) {
        const token = sessionStorage.getItem("access_token");
        if (token) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
      },
      success: function (response) {
        resolve(response); // Resolver la promesa con la respuesta
        // Parsea la fecha/hora recibida a un objeto moment
        var hora = moment(response.resultado.hora);
        var horaFormateada = hora.format('LLLL');
        $('#miModal .modal-title').text("Detalles del Viaje");

        // $('#autocomplete1').val(response.resultado.inicioViaje);
        // actualizarMapaConDireccion(response.resultado.inicioViaje);
        // Suponiendo que quieres actualizar el mapa con ID 'map1' con la dirección de inicio del viaje
        // actualizarMapaConDireccion(response.resultado.inicioViaje, 'map1');
        // actualizarMapaConDireccion(response.resultado.finViaje, 'map2');
        // console.log(mapas["map1"]);
        // Actualiza el cuerpo del modal con la información del viaje
        $('#miModal .modal-body').html(`
                <p>DETALLE DE PARTIDA: ${response.resultado.detalle1Viaje}</p>
                <p>DETALLE DE PARTIDA: ${response.resultado.detalle2Viaje}</p>
                <p>FECHA: ${horaFormateada}</p>
                <p>COSTO: ${response.resultado.costo}</p>
                <p>ASIENTOS DISPONIBLES: ${response.resultado.asientos}</p>
          <form id="formCond">
            <div class="form-col">
              <!-- INICIO: modal del tipo de carro -->
              <!-- Modal -->
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">DATOS ADICIONALES</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      <!-- CUERPO DEL MODAL -->
                      <div class="form-group">
                        <label>TIPO</label>
                        <!-- <button type="button" class="btn btn-outline-secondary">Tipo</button> -->
                        <select class="custom-select custom-select-lg ">
                          <option value="1">Propio</option>
                          <option value="2">Alquilado</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>FABRICANTE</label>
                        <select class="custom-select custom-select-lg form-control" id="exampleInputEmail1">
                          <option value="1">Alfa romero</option>
                          <option value="2">Audi</option>
                          <option value="2">bently</option>
                          <option value="2">DBW</option>
                          <option value="2">Audi</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>AÑO</label>
                        <select class="custom-select custom-select-lg form-control" id="exampleInputEmail1">
                          <option value="1">2023</option>
                          <option value="2">2022</option>
                          <option value="3">2021</option>
                          <option value="3">2020</option>
                          <option value="3">2019</option>
                          <option value="3">2018</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>COLOR DEL CARRO</label>
                        <input type="color" class="form-control" id="colorPicker">
                      </div>
                      <div class="form-group">
                        <label>PLACA</label>
                        <input type="text" class="form-control" id="colorPicker">
                      </div>
                      <div class="form-group">
                        <label>Foto del conductor</label>
                        <div class="col mb-3 d-flex justify-content-center align-items-center text-center">
                          <img id="imagePreview" class="img-fluid" alt="adjuntar imagen" style="max-height: 30vh;min-width: 50px;">
                        </div>
                        <div class="col mb-3">
                          <input type="file" class="form-control-file " id="exampleFormControlFile1" onchange="previewImage()">
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- FIN: modal del tipo de carro -->
              <!-- Agrega esto en tu formulario para crear pestañas -->
              <div class="col-md-12 mb-3">
                <ul class="nav nav-tabs" id="myTabs" role="tablist">
                  <li class="nav-item">
                    <a class="nav-link active" id="inicio-tab" data-toggle="tab" href="#inicio" role="tab" aria-controls="inicio" aria-selected="true">Punto de inicio</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="llegada-tab" data-toggle="tab" href="#llegada" role="tab" aria-controls="llegada" aria-selected="false">Punto de Llegada</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="vehiculo-tab" data-toggle="tab" href="#vehiculo" role="tab" aria-controls="vehiculo" aria-selected="false">Detalle del Vehículo</a>
                  </li>
                </ul>
                <div class="tab-content" id="myTabsContent">
                  <!-- Inicio del Viaje -->
                  <div class="tab-pane fade show active" id="inicio" role="tabpanel" aria-labelledby="inicio-tab">
                    <!-- Contenido de Inicio del Viaje -->
                    <!-- ... Tu código existente para Inicio del Viaje ... -->
                    <div class="col-md-13 mb-3 containerGrid">
                      <div class="txtUbicacion">
                        <div class="col mb-3">
                          <input type="text" class="form-control" placeholder="INICIO DEL VIAJE" required id="autocomplete1" name="autocomplete1">
                        </div>
                      </div>
                      <div class="divMapsG">
                        <div id="map1" class=""></div>
                      </div>
                    </div>
                  </div>
                  <!-- Punto de Llegada -->
                  <div class="tab-pane fade" id="llegada" role="tabpanel" aria-labelledby="llegada-tab">
                    <!-- Contenido de Punto de Llegada -->
                        <div class="containerGrid">
                            <div class="txtUbicacion">
                                <div class="col-md-12 mb-3">
                                    <input type="text" class="form-control" placeholder="LLEGADA DEL VIAJE" required id="autocomplete2" name="autocomplete2">
                                </div>
                            </div>
                            <div class="divMapsG">
                                <div id="map2"></div>
                            </div>
                        </div>
                  </div>
                  <!-- Horario del Viaje -->
                  <!-- Detalle del Vehículo -->
                  <div class="tab-pane fade" id="vehiculo" role="tabpanel" aria-labelledby="vehiculo-tab">
                    <!-- Contenido de Detalle del Vehículo -->
                    <!-- ... Tu código existente para Detalle del Vehículo ... -->
                    <div class="GridV">
                      <div class="gridV2">
                        <div class="col mb-3">
                          <span>ASIENTOS</span>
                          <div class="input-group-prepend">
                            <select id="asientosSelect" class="custom-select custom-select-lg ">
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="3">4</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="gridV4">
                        <!-- <div class="col mb-3"> -->
                        <span>METODO DE PAGO DINAMICO</span>
                        <div class="row justify-content-center align-items-center">
                          <!-- Parte izquierda con imagen | yape-->
                          <div class="col mb-3" style="max-height: 8vh; max-width:10vh;">
                            <div class="card seleccionable" data-valor="1" id="izquierda" style="width: 100%;">
                              <img src="https://seeklogo.com/images/Y/yape-logo-36579BE1F6-seeklogo.com.png" class="card-img-top" alt="Imagen Izquierda" style="height: 100%;">
                            </div>
                          </div>
                          <!-- colocar el vw o vh dependiendo de cual sea mayor -->
                          <!-- Parte derecha con imagen | plin-->
                          <div class="col mb-3" style="max-height: 8vh; max-width:10vh;">
                            <div class="card seleccionable" data-valor="2" id="derecha" style="width: 100%;">
                              <img src="https://seeklogo.com/images/P/plin-logo-967A4AF583-seeklogo.com.png" class="card-img-top" alt="Imagen Derecha" style="height: 100%;">
                            </div>
                          </div>
                        </div>
                        <!-- </div> -->
                      </div>
                  </div>
                </div>
                <!-- <button id="btnPublicar" class="btn btn-primary form-control" type="submit" style="display: none;">publicar viaje</button> -->
                <button id="btnPublicar" class="btn btn-primary form-control" type="submit" style="display: none;">Comprar pasaje</button>
              </div>
            </div>
          </form>`);
        // Actualiza los inputs con los datos de respuesta
        // Estos elementos deben existir dentro de la estructura HTML que acabas de insertar
        $('#autocomplete1').val(response.resultado.inicioViaje).attr('readonly', true);
        $('#autocomplete2').val(response.resultado.finViaje).attr('readonly', true);
        console.log(response.resultado.inicioViaje);
        console.log(response.resultado.finViaje);
        // actualizarMapaConDireccion (response.mensaje.inicioViaje, 'map1');
        // actualizarMapaConDireccion (response.mensaje.finViaje, 'map2');
        // Ahora, actualizamos el select de asientos basado en los asientos disponibles
        var asientosDisponibles = response.resultado.asientos;
        var opcionesAsientos = '';
        for (var i = 1; i <= asientosDisponibles; i++) {
          opcionesAsientos += `<option value="${i}" style="max-width: 90%;" class="custom-select">${i}</option>`;
        }
        // custom-select-lm
        $('#asientosSelect').html(opcionesAsientos);
        $(document).ready(function () {
          $('.seleccionable').click(function () {
            // Obtener el valor asignado a la tarjeta clicada
            var valor = $(this).data('valor');
            // Desmarcar todas las tarjetas
            $('.seleccionable').removeClass('seleccionada');
            // Marcar solo la tarjeta clicada
            $(this).addClass('seleccionada');
            // Mostrar en la consola el valor de la tarjeta seleccionada
            // Aquí puedes hacer algo con el valor seleccionado, por ejemplo:
            console.log("Has seleccionado el método de pago con el valor:", valor);
          });
        });
        // Muestra el modal
        $('#miModal').modal('show');
        // $('#miModal').on('shown.bs.modal', function () {
        // setTimeout(function () {
        //   actualizarMapaConDireccion(response.resultado.inicioViaje, 'map1');
        //   actualizarMapaConDireccion(response.resultado.finViaje, 'map2');
        // }, 50);
        // }
        // actualizarMapaConDireccion(response.resultado.inicioViaje, 'map1');
        // actualizarMapaConDireccion(response.resultado.finViaje, 'map2');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error al cargar el detalle del viaje", textStatus, errorThrown, jqXHR);
        // Manejar adecuadamente el error
      }
    });
  });
};
$(document).ready(function () {
  // Inicialmente, el botón está oculto
  $('#btnPublicar').hide();

  // Función para verificar si se deben mostrar el botón
  function mostrarBotonSiEsValido() {
    // Verifica si se ha seleccionado un método de pago y una cantidad de asientos
    var metodoPagoSeleccionado = $('.seleccionable.seleccionada').length > 0;
    var asientosSeleccionados = $('#asientosSelect').val() !== '';

    // Si ambos son verdaderos, muestra el botón, de lo contrario, lo oculta
    if (metodoPagoSeleccionado && asientosSeleccionados) {
      $('#btnPublicar').show();
    } else {
      $('#btnPublicar').hide();
    }
  }

  // Evento al seleccionar una tarjeta de método de pago
  $(document).on('click', '.seleccionable', function () {
    // Obtener el valor asignado a la tarjeta clicada
    var valor = $(this).data('valor');
    // Desmarcar todas las tarjetas
    $('.seleccionable').removeClass('seleccionada');
    // Marcar solo la tarjeta clicada
    $(this).addClass('seleccionada');

    console.log("Tarjeta seleccionada con valor: ", valor);

    // Llama a la función que verifica si se deben mostrar el botón
    mostrarBotonSiEsValido();
  });

  // Evento al cambiar el select de asientos
  $(document).on('change', '#asientosSelect', function () {
    console.log("Cambio en selección de asientos");

    // Llama a la función que verifica si se deben mostrar el botón
    mostrarBotonSiEsValido();
  });
});

$('#tablePrec1 tbody').on('click', '.btn-elegir', function () {
  var viajeID = $(this).data('id');
  cargarDetalleViaje(viajeID)
    .then(response => {
      // Prepara el contenido del modal aquí con los datos de `response`
      // Ahora inicia la inicialización de los mapas
      return Promise.all([
        import('./prueba.js').then(module => module.initMap('map1', 'autocomplete1', response.resultado.inicioViaje)),
        import('./prueba.js').then(module => module.initMap('map2', 'autocomplete2', response.resultado.finViaje)),
        actualizarMapaConDireccion(response.resultado.inicioViaje, 'map1'),
        actualizarMapaConDireccion(response.resultado.finViaje, 'map2'),
      ]);
    })
    .then(() => {
      // Todo está listo, muestra el modal
      $('#miModal').modal('show');
    })
    .catch(error => {
      console.error("Error cargando los detalles del viaje o inicializando los mapas:", error);
    });
});
import { dominio } from '../js/validador.js';
import { actualizarMapaConDireccion, initMap } from '../js/prueba.js';