// export class localizacion {
//     constructor(callback) {
//         // if (navigator.geolocation) {
//         //     navigator.geolocation.getCurrentPosition((position) => {
//         //         this.latitude = position.coords.latitude;
//         //         this.longitude = position.coords.longitude;

//         //         // callback();
//         //         callback({ lat: this.latitude, lng: this.longitude });
//         //     });
//         // } else {
//         //     alert("no se pudo");
//         // }



//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 this.latitude = position.coords.latitude;
//                 this.longitude = position.coords.longitude;

//                 // callback();
//                 callback({ lat: this.latitude, lng: this.longitude });
//             });
//         } else {
//             alert("No se pudo obtener la ubicación.");
//         }
//     }
// };
class localizacion {
    constructor(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;

                callback();
            });
        } else {
            alert("no se pudo");
        }
    }
}
;

