// import { registerMap } from './mapManager.js';
let mapas = {};
// Esta función ajusta qué campo es requerido basado en la sección visible
function ajustarCamposRequeridos() {
    // Aquí determinamos cuál de los campos autocomplete debería tener el atributo required.
    // Esta lógica depende de cómo determines cuál sección o campo está activo/visible para el usuario.
    // Por simplicidad, asumiré que si el usuario está interactuando con el mapa 1, entonces 'autocomplete1' es el relevante, y similarmente para 'autocomplete2'.
    // Debes ajustar esta lógica a tu caso de uso específico.
    if (document.getElementById('map1').style.display !== 'none') { // Suponiendo que manejas la visibilidad de tus mapas de esta manera
        // alert("map1Prueba.js");
        document.getElementById('autocomplete1').setAttribute('required', '');
        document.getElementById('autocomplete2').removeAttribute('required');
    } else if (document.getElementById('map2').style.display !== 'none') {
        alert("map2Prueba.js");
        document.getElementById('autocomplete2').setAttribute('required', '');
        document.getElementById('autocomplete1').removeAttribute('required');
    }
};
export async function initMap(mapElementId, autocompleteElementId) {

    // return new Promise((resolve, reject) => {

    return new Promise((resolve, reject) => {
        const mapElement = document.getElementById(mapElementId);
        if (!mapElement) {
            console.warn(`El elemento del mapa ${mapElementId} no existe en el DOM.`);
            resolve(); // Considera resolver la promesa incluso si el elemento no existe para evitar bloquear la cadena de promesas.
            return;
        }
        // if (!document.getElementById(mapElementId)) {
        //     console.error(`El elemento del mapa ${mapElementId} no existe en el DOM.`);
        //     return;
        // }
        else {
            const geocoder = new google.maps.Geocoder();
            const ubicacion = new localizacion(() => {
                const myLatLng = { lat: ubicacion.latitude, lng: ubicacion.longitude };
                if (!myLatLng.lat || !myLatLng.lng) {
                    console.error("Error: No se ha obtenido la ubicación.");
                    return; // Detener la ejecución si no hay ubicación
                }
                const options = {
                    center: myLatLng,
                    // zoom: 17,
                    // maxZoom: 28,
                    // streetViewControl: false,
                    // fullscreenControl: false
                    zoom: 17,
                    draggable: true,
                    // draggable: !esMapaEstatico,
                    zoomControl: !esMapaEstatico,
                    // zoomControl: true,
                    scrollwheel: esMapaEstatico,
                    // scrollwheel: !esMapaEstatico,
                    // disableDoubleClickZoom: esMapaEstatico,
                    disableDoubleClickZoom: !esMapaEstatico,
                    streetViewControl: !esMapaEstatico,
                    fullscreenControl: !esMapaEstatico,
                    // mapTypeControl: !esMapaEstatico
                    mapTypeControl: !esMapaEstatico
                };
                const map = new google.maps.Map(document.getElementById(mapElementId), options);

                mapas[mapElementId] = map;
                const marcador = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    title: "Mi primer marcador",
                    draggable: !esMapaEstatico, // Hacer el marcador arrastrable
                });

                if (!esMapaEstatico) {
                    // Agregar botón de ubicación actual al mapa
                    const locationButton = document.createElement("button");
                    locationButton.textContent = "Ubicación Actual";
                    locationButton.classList.add("custom-map-control-button");
                    // Añade el botón al mapa en la posición deseada
                    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

                    locationButton.addEventListener("click", (event) => {
                        event.preventDefault(); // Evita la acción predeterminada del botón
                        ajustarCamposRequeridos(); // Asegura que solo el campo relevante sea requerido antes de proceder
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition((position) => {
                                const pos = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude
                                };
                                map.setCenter(pos);
                                marcador.setPosition(pos);

                                // Geocodificación inversa para obtener dirección a partir de coordenadas
                                geocoder.geocode({ 'location': pos }, (results, status) => {
                                    if (status === google.maps.GeocoderStatus.OK) {
                                        if (results[0]) {
                                            // Aquí actualizas el valor del input autocompleteElementId con la dirección obtenida
                                            document.getElementById(autocompleteElementId).value = results[0].formatted_address;
                                        } else {
                                            window.alert('No se encontraron resultados.');
                                        }
                                    } else {
                                        window.alert('La geocodificación falló debido a: ' + status);
                                    }
                                });

                            }, () => {
                                handleLocationError(true, map.getCenter());
                            });
                        } else {
                            alert("no soporta")
                            // El navegador no soporta Geolocalización
                            handleLocationError(false, map.getCenter());
                        }
                    });
                }
                // Listener para manejar el evento cuando el marcador es soltado después de arrastrar
                marcador.addListener('dragend', function (event) {
                    // Aquí puedes hacer algo con la nueva ubicación del marcador
                    // Por ejemplo, actualizar campos de formulario o recargar el mapa en la nueva ubicación
                    console.log(event.latLng.lat(), event.latLng.lng());
                    // Actualizar la ubicación del mapa para centrar el nuevo lugar del marcador
                    map.panTo(event.latLng);
                });
                const informacion = new google.maps.InfoWindow();
                marcador.addListener('click', () => {
                    informacion.open(map, marcador);
                });
                const autocomplete = new google.maps.places.Autocomplete(document.getElementById(autocompleteElementId));
                autocomplete.bindTo("bounds", map);
                autocomplete.addListener('place_changed', () => {
                    informacion.close();
                    marcador.setVisible(false);

                    const place = autocomplete.getPlace();
                    if (!place.geometry || !place.geometry.viewport) {
                        window.alert("Error al mostrar el lugar");
                        return;
                    }
                    map.fitBounds(place.geometry.viewport);
                    marcador.setPosition(place.geometry.location);
                    marcador.setVisible(true);
                    const address = [
                        place.address_components[0] && place.address_components[0].short_name || '',
                        place.address_components[1] && place.address_components[1].short_name || '',
                        place.address_components[2] && place.address_components[2].short_name || '',
                    ];
                    informacion.setContent(`<div>${place.name}</div><br>${address.join('<br>')}`);
                    informacion.open(map, marcador);
                });
                marcador.addListener('dragend', function (event) {
                    // Obtener las coordenadas del marcador después de arrastrarlo
                    const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };

                    // Usar geocodificación inversa para obtener la dirección
                    geocoder.geocode({ 'location': latLng }, function (results, status) {
                        if (status === 'OK') {
                            if (results[0]) {
                                // Actualizar el campo de dirección con la dirección obtenida
                                document.getElementById(autocompleteElementId).value = results[0].formatted_address;
                                // Centrar el mapa en la nueva ubicación del marcador
                                map.panTo(latLng);
                            } else {
                                window.alert('No se encontraron resultados.');
                            }
                        } else {
                            window.alert('Geocoder falló debido a: ' + status);
                        }
                    });
                });
            });
        }
        // Al final del proceso de inicialización (quizás después de cargar la ubicación inicial o similar), llama a resolve():
        resolve();
    });
};
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: El servicio de Geolocalización falló.' :
        'Error: Tu navegador no soporta geolocalización.');
    infoWindow.open(map);
};

export function actualizarMapaConDireccion(direccion, mapElementId) {
    // Verifica si el mapa ha sido inicializado
    // if (typeof mapas[mapElementId] === 'undefined') {
    //     console.error(`El mapa ${mapElementId} aún no está inicializado.`);
    //     return; // Termina la ejecución de la función si el mapa no existe
    // }
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': direccion }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            let map = mapas[mapElementId]; // Obtener la instancia correcta del mapa
            // console.log("valor de map es:", map);
            if (map) {
                // Asegúrate de que el mapa se haya redimensionado correctamente para mostrar el marcador.
                google.maps.event.trigger(map, 'resize');
                map.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                console.error('El mapa no está definido.');
            }
        } else {
            alert('No se pudo geocodificar la dirección debido a: ' + status);
        }
    });
};
// $('#miModal').on('shown.bs.modal', function () {
//     Promise.all([
//         initMap('map1', 'autocomplete1'),
//         initMap('map2', 'autocomplete2')
//     ]).then(() => {
//         console.log("THEN PROMESA DE: map1 y map2");

//         // Verifica que los mapas estén definidos antes de intentar redimensionarlos
//         if (mapas['map1']) {
//             console.log("entre en mapas['map1'])")
//             google.maps.event.trigger(mapas['map1'], 'resize');
//             // Aquí puedes ajustar el centro si es necesario, por ejemplo:
//             // mapas['map1'].setCenter(nuevaUbicacion);
//         }
//         if (mapas['map2']) {
//             console.log("entre en mapas['map2'])")
//             google.maps.event.trigger(mapas['map2'], 'resize');
//             // Igual que para map1, ajusta el centro si es necesario
//             // mapas['map2'].setCenter(nuevaUbicacion);
//         }
//         // Lugar adecuado para llamar a actualizarMapaConDireccion si tienes las direcciones listas
//         // Nota: asegúrate de tener las direcciones o coordenadas necesarias disponibles
//         // actualizarMapaConDireccion(direccion1, 'map1');
//         // actualizarMapaConDireccion(direccion2, 'map2');
//     }).catch(error => {
//         console.error("Error al inicializar los mapas: ", error);
//     });
// });
// $('#tablePrec1 tbody').on('click', '.btn-elegir', function () {
//     var viajeID = $(this).data('id');
//     $('#miModal').modal('show');

//     $('#miModal').one('shown.bs.modal', function () {
//         cargarDetalleViaje(viajeID)
//             .then(response => {
//                 // Aquí tienes acceso a response.resultado.inicioViaje y response.resultado.finViaje
//                 // Inicializa los mapas después de que el modal se haya mostrado completamente
//                 Promise.all([
//                     initMap('map1', 'autocomplete1'),
//                     initMap('map2', 'autocomplete2')
//                 ]).then(() => {
//                     console.log("Mapas inicializados");

//                     // Actualiza las direcciones después de que los mapas estén inicializados
//                     actualizarMapaConDireccion(response.resultado.inicioViaje, 'map1');
//                     actualizarMapaConDireccion(response.resultado.finViaje, 'map2');
//                 }).catch(error => {
//                     console.error("Error inicializando los mapas:", error);
//                 });
//             })
//             .catch(error => {
//                 console.error("Error al obtener detalles del viaje:", error);
//             });
//     });
// });



// $('#miModal').on('shown.bs.modal', function () {
//     Promise.all([
//         initMap('map1', 'autocomplete1'),
//         initMap('map2', 'autocomplete2')
//     ]).then(() => {
//         console.log("THEN PROMESA DE: map1 y map2");
//         // Lugar adecuado para llamar a actualizarMapaConDireccion si tienes las direcciones listas
//     }).catch(error => {
//         console.error("Error al inicializar los mapas: ", error);
//     });
// });
// $('#miModal').on('shown.bs.modal', async function () {
//     try {
//         // Esperar a que ambos mapas se inicialicen
//         await Promise.all([
//             initMap('map1', 'autocomplete1'),
//             initMap('map2', 'autocomplete2')
//         ]);
//         // Ahora ambos mapas están inicializados y puedes actualizarlos si es necesario
//         console.log("Ambos mapas han sido inicializados");
//         // Aquí podrías llamar a actualizarMapaConDireccion si ya tienes la dirección disponible
//     } catch (error) {
//         console.error("Error al inicializar los mapas: ", error);
//     }
// });

// Llama a initMap para cada mapa y autocomplete:
// window.addEventListener("load", function () {
//     initMap('map1', 'autocomplete1');
//     initMap('map2', 'autocomplete2');
// });

// $('#miModal').on('shown.bs.modal', function () {
//     initMap('map1', 'autocomplete1');
//     initMap('map2', 'autocomplete2');
// });


// $('#miModal').on('shown.bs.modal', function () {
//     setTimeout(function () {
//         initMap('map1', 'autocomplete1');
//         initMap('map2', 'autocomplete2');
//     }, 200); // Ajusta el tiempo según sea necesario
// });
// $(document).ready(function () {
//     initMap('map1', 'autocomplete1');
//     initMap('map2', 'autocomplete2');
// });
// $(document).ready(function () {
//     inicializarMapasSiEsNecesario();
// });
// $('#miModal').on('shown.bs.modal', function () {
//     // Aquí puedes optar por usar setTimeout si crees que es necesario, pero en la mayoría de los casos no debería serlo.
//     setTimeout(function () {
//         // initMap('map1', 'autocomplete1');
//         // initMap('map2', 'autocomplete2');
//         inicializarMapasSiEsNecesario();
//     }, 150);
// });

// $(document).ready(function () {
//     // Intenta inicializar los mapas inmediatamente.
//     initMapsIfNeeded();

//     // Si los mapas están dentro de un modal, asegúrate de que se ajusten correctamente cuando el modal se muestre.
//     $('#miModal').on('shown.bs.modal', function () {
//         initMapsIfNeeded();
//     });
// });
// $('#miModal').on('shown.bs.modal', function () {
//     initMapsIfNeeded();
// });

// function initMapsIfNeeded() {
//     // Solo intenta inicializar map1 si el elemento existe en el DOM
//     if ($('#map1').length > 0 && typeof mapas["map1"] === 'undefined') {
//         initMap('map1', 'autocomplete1');
//     }

//     // Solo intenta inicializar map2 si el elemento existe en el DOM
//     if ($('#map2').length > 0 && typeof mapas["map2"] === 'undefined') {
//         initMap('map2', 'autocomplete2');
//     }

//     // Aquí no necesitas ajustar el tamaño del mapa con google.maps.event.trigger
//     // a menos que estés seguros de que los mapas existen y necesitan ser reajustados.
// }

// function inicializarMapasSiEsNecesario() {
//     if ($('#map1').length && typeof mapas["map1"] === 'undefined') {
//         initMap('map1', 'autocomplete1');
//     }
//     if ($('#map2').length && typeof mapas["map2"] === 'undefined') {
//         initMap('map2', 'autocomplete2');
//     }
// }


// export function actualizarMapaConDireccion(direccion) {
//     var geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ 'address': direccion }, function (results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             // Centra el mapa en la ubicación geocodificada
//             // mapa.setCenter(results[0].geometry.location);
//             map.setCenter(results[0].geometry.location);

//             // Opcional: Agrega un marcador en la ubicación
//             var marcador = new google.maps.Marker({
//                 // map: mapa,
//                 map: map,
//                 position: results[0].geometry.location
//             });
//         } else {
//             alert('No se pudo geocodificar la dirección debido a: ' + status);
//         }
//     });
// }


// Archivo: prueba.js o destination.js, dependiendo de la estructura de tu proyecto


