// var ubicacion = new Localizacion();
// console.log(ubicacion);

function initMap() {

    const ubicacion = new Localizacion(() => {

        const options = {
            center: {
                lat: ubicacion.latitude,
                long: ubicacion.longitude
            },

            zoom: 8
        }
        var map = document.getElementById('map');
        const mapa = new google.maps.Map(map, options);
    });
}