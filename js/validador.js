// // export const dominio = 'http://127.0.0.1:5000';
const dominio = 'http://127.0.0.1:5000';
window.addEventListener('load', (e) => {
    checkSession();
    iniciarSesion();
    // if (window.location.pathname === "/index.html") {
    //     // evaluarCampos();
    // } else {
    //     // cerrarSesion();
    //     // console.log("cerrarrrr");
    // }
});

function setSession(token) {
    sessionStorage.setItem("access_token", token);
}

function isSessionValid(token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `${dominio}/protectedctc`,
            dataType: "json",
            headers: {
                'Authorization': 'cabecera' + token
            },
            success: function (response) {
                resolve(response["exito"]);
                // console.log("valor sessionvalida", resolve(response["exito"]));
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function cerrarSesion() {
    if (window.location.pathname !== "/pages/Login.html") {
        const btnLogout = document.getElementById('btnLogout');
        btnLogout.addEventListener('click', (e) => {
            mensajeConfirmacion('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?').then((booleano) => {
                if (booleano) {
                    sessionStorage.setItem("access_token", null);
                    checkSession();
                }
            });
        });
    }
}

// Función para verificar si el usuario ha iniciado sesión
function checkSession() {
    let tokenC = sessionStorage.getItem("access_token");
    isSessionValid(tokenC).then(validarSesion => {
        if (validarSesion) {
            console.log("Estoy en checkSession:", window.location.pathname);
            if (window.location.pathname === "/pages/Login.html") {
                window.location.href = '/pages/inicio.html'
            }
        } else if (window.location.pathname !== "/pages/Login.html") {
            window.location.href = '../pages/Login.html';
        }
    }).catch(error => {
        console.log(error);
    });
}

function iniciarSesion() {
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        var correo = $('#txtDniL').val();
        var password = $('#txtPassL').val();

        $.ajax({
            url: `${dominio}/loginctc`,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                CorreoTrabajador: correo,
                PasswordTrabajador: password
            }),
            success: function (response) {
                if (response["mensaje"]) {
                    setSession(response["mensaje"]);
                    checkSession();
                } else {
                }
            },
            error: function () {
            }
        });
    });
}

