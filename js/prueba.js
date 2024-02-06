
// import { localizacion } from '../js/localizacion.js';

// async function initMap(mapElementId, autocompleteElementId) {
//     const ubicacion = new localizacion((coords) => {
//         const myLatLng = { lat: coords.lat, lng: coords.lng };

//         if (!myLatLng.lat || !myLatLng.lng) {
//             console.error("Error: No se ha obtenido la ubicación.");
//             return; // Detener la ejecución si no hay ubicación
//         }

//         const options = {
//             center: myLatLng,
//             zoom: 15,
//             maxZoom: 22,
//             streetViewControl: false,
//             fullscreenControl: false
//         };

//         const map = new google.maps.Map(document.getElementById(mapElementId), options);

//         const marcador = new google.maps.Marker({
//             position: myLatLng,
//             map: map,
//             title: "Mi primer marcador",
//         });

//         const informacion = new google.maps.InfoWindow();

//         marcador.addListener('click', () => {
//             informacion.open(map, marcador);
//         });

//         const autocomplete = new google.maps.places.Autocomplete(
//             document.getElementById(autocompleteElementId)
//         );
//         autocomplete.bindTo("bounds", map);

//         autocomplete.addListener('place_changed', () => {
//             informacion.close();
//             marcador.setVisible(false);

//             const place = autocomplete.getPlace();
//             if (!place.geometry || !place.geometry.viewport) {
//                 window.alert("Error al mostrar el lugar");
//                 return;
//             }

//             map.fitBounds(place.geometry.viewport);
//             marcador.setPosition(place.geometry.location);
//             marcador.setVisible(true);

//             const address = [
//                 place.address_components[0] && place.address_components[0].short_name || '',
//                 place.address_components[1] && place.address_components[1].short_name || '',
//                 place.address_components[2] && place.address_components[2].short_name || '',
//             ];
//             informacion.setContent(
//                 `<div>${place.name}</div><br>${address.join('<br>')}`
//             );
//             informacion.open(map, marcador);
//         });
//     });
// }

// window.addEventListener("load", function () {
//     initMap('map1', 'autocomplete1');
//     initMap('map2', 'autocomplete2');
// });


async function initMap(mapElementId, autocompleteElementId) {
    const ubicacion = new localizacion(() => {
        const myLatLng = { lat: ubicacion.latitude, lng: ubicacion.longitude };

        if (!myLatLng.lat || !myLatLng.lng) {
            console.error("Error: No se ha obtenido la ubicación.");
            return; // Detener la ejecución si no hay ubicación
        }

        const options = {
            center: myLatLng,
            zoom: 15,
            maxZoom: 22,
            streetViewControl: false,
            fullscreenControl: false
        };

        const map = new google.maps.Map(document.getElementById(mapElementId), options);




        const marcador = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: "Mi primer marcador",
        });

        const informacion = new google.maps.InfoWindow();

        marcador.addListener('click', () => {
            informacion.open(map, marcador);
        });


        const autocomplete = new google.maps.places.Autocomplete(
            document.getElementById(autocompleteElementId)
        );
        autocomplete.bindTo("bounds", map);

        autocomplete.addListener('place_changed', () => {
            informacion.close();
            marcador.setVisible(false);

            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.viewport) {
                window.alert("error al mostrar el lugar");
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
            informacion.setContent(
                `<div>${place.name}</div><br>${address.join('<br>')}`
            );
            informacion.open(map, marcador);
        });

    });
}

// Llama a initMap para cada mapa y autocomplete:

window.addEventListener("load", function () {
    initMap('map1', 'autocomplete1');
    initMap('map2', 'autocomplete2');

});
