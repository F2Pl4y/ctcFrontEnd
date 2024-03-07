const dominio = 'http://127.0.0.1:5000';
// Función para establecer el token en sessionStorage.
function setSession(token) {
    sessionStorage.setItem("access_token", token);
}
var rutaActual = window.location.pathname;
// console.log("estoy dentro de: ", rutaActual);
// console.log("estoy en window.location.pathname.endsWith(.html):", window.location.pathname.endsWith(".html"));
// Función para validar la sesión con el backend.
function isSessionValid(token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'GET',
            url: `${dominio}/protectedctc`,
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                console.log("isSessionValid - response ->", response);
                console.log("isSessionValid['exito']:\n", response['exito']);
                if (response['exito']) {//si es false entonces...
                    console.log("entre a response['exito']");
                    // let isInicio = window.location.pathname.endsWith("inicio.html");
                    // if (isInicio) {
                    //     window.location.h ref = '../index.html';
                    // } else {
                    //     window.location.h ref = 'pages/inicio.html';
                    // }
                    // console.log("dentro de succes", window.location.pathname.endsWith("/pages/inicio.html"))
                    // if (window.location.pathname.endsWith("/index.html")) {
                    if (rutaActual == "/pages/Login.html") {
                        console.log("mi token dentro de pages:", token)
                        window.location.href = 'inicio.html';
                        if (token) {
                            isSessionValid(token).then(isValidSession => {
                                if (isValidSession) {
                                    console.log("te mantienes en index.html");

                                } else {
                                    console.log("no tienes token y te quedas en index.html");
                                }
                            });
                        } else {
                            console.log("no tienes token y te quedas en index.html");
                        }
                    }
                    resolve(true);
                } else {
                    console.log("HOLAAAAAAAA");
                    resolve(false);
                }
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
    console.log("valor de tokenc:", tokenC);
    console.log("valor de !tokenc:", !tokenC);
    // Si estamos en la página de login y hay un token, verifica la validez.
    // if (isLogin && tokenC) {
    if (!tokenC == null || tokenC) {
        // alert("entramos");
        console.log("esto en tokenC || !tokenC == null)");
        isSessionValid(tokenC).then(isValidSession => {
            console.log("valor de isValidSession", isValidSession)
            if (isValidSession) {
                let isInicio = window.location.pathname.endsWith("inicio.html");
                if (isInicio) {
                    console.log("BIENVENIDO");
                } else {
                    let isIndex = window.location.pathname.endsWith("inicio.html");
                    if (isIndex) {
                        window.location.href = '../index.html';
                    }
                } // Redirige a inicio si la sesión es válida.
                console.log("valor de rutaActual en check", rutaActual)
            } // Si la sesión no es válida, no hace falta redirigir porque ya está en login.html.
            else if (rutaActual == "/inicio.html" && !isValidSession) {
                console.log("VALIO BERTA");
                // window.location.href = '../index.html';
            }
        });
        // } else if (!tokenC && !isLogin) {
    }
    else if (!tokenC || !tokenC == null) {
        console.log("valores del tokcenC", tokenC);
        console.log("entramos a null");
        // Si no estamos en login y no hay token, redirige a login.html.
        if (rutaActual == "/index.html") {
            // window.location.href = '/Login.html';
            // window.location.href = 'pages/Login.html';
        } else {
            // window.location.href = 'Login.html';
        }
    }
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
                console.log("VALOR EN iniciarSesion", response); // Agrega esto para depurar
                // if (!response["mensaje"]) {
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
    checkSession();
    iniciarSesion(); // Esta llamada debería condicionarse a estar en la página de login específicamente.
    console.log("llamando al inicio");
});
