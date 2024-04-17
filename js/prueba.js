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
                    scrollwheel: true,
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