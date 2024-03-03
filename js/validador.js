// ---------------
// Definición del dominio de tu API.
const dominio = 'http://127.0.0.1:5000';

// Función para establecer el token en sessionStorage.
function setSession(token) {
    sessionStorage.setItem("access_token", token);
}

// Función para validar la sesión con el backend.
function isSessionValid(token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `${dominio}/protectedctc/`,
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                console.log("Respuesta exitosa:", response);
                resolve(true);
            },
            error: function (error) {
                console.log("Error en la solicitud:", error);
                resolve(false); // Se resuelve false en caso de error para manejar la redirección.
            }
        });
    });
}

// Función para cerrar sesión.
function cerrarSesion() {
    sessionStorage.setItem("access_token", null); // Limpia el token almacenado.
    window.location.href = 'Login.html'; // Redirige al usuario a la página de inicio de sesión.
}

// Función para verificar la sesión al cargar la página.
function checkSession() {
    let tokenC = sessionStorage.getItem("access_token");
    let isLogin = window.location.pathname.endsWith("Login.html");

    // Si estamos en la página de login y hay un token, verifica la validez.
    if (isLogin && tokenC) {
        isSessionValid(tokenC).then(isValidSession => {
            if (isValidSession) {
                window.location.href = 'inicio.html'; // Redirige a inicio si la sesión es válida.
            } // Si la sesión no es válida, no hace falta redirigir porque ya está en login.html.
        });
    } else if (!tokenC && !isLogin) {
        // Si no estamos en login y no hay token, redirige a login.html.

        if (window.location.pathname == "/index.html") {
            // window.location.href = '/Login.html';
            window.location.href = 'pages/Login.html';
        } else {
            window.location.href = 'Login.html';
        }

        // pages/Login.html
    }
    // No hace nada si hay un token y no está en la página de login (asume que la sesión es válida).
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
            data: JSON.stringify({ dniUser: correo, PasswordTrabajador: password }),
            success: function (response) {
                console.log(response); // Agrega esto para depurar
                if (response["mensaje"]) {
                    setSession(response["mensaje"]);
                    window.location.href = 'inicio.html';
                } else {
                    console.log("Inicio de sesión fallido");
                }
            },

            error: function (error) {
                console.log("Error en la solicitud de inicio de sesión:", error);
            }
        });
    });
}

// Llamadas iniciales.
window.addEventListener('load', (e) => {
    console.log("EJECUTANDO ACTUALIZACION")
    checkSession();
    console.log("EJECUTANDO ACTUALIZACION")
    iniciarSesion(); // Esta llamada debería condicionarse a estar en la página de login específicamente.
    console.log("EJECUTANDO ACTUALIZACION")
});
