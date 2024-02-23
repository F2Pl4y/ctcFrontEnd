const filasPorPagina = 4;

function generarBotonesYMostrarFilas(tablaId, pagina) {
    var tabla = document.getElementById(tablaId);
    var numFilas = tabla.querySelectorAll("tbody tr").length;
    var numPaginas = Math.ceil(numFilas / filasPorPagina);

    var paginationButtons = document.getElementById(tablaId + "PaginationButtons");
    paginationButtons.innerHTML = ""; // Limpia los botones existentes

    for (var i = 0; i < numPaginas; i++) {
        var li = document.createElement("li");
        li.innerHTML = '<a type="button" onclick="generarBotonesYMostrarFilas(\'' + tablaId + '\',' + i + ')">' + (i + 1) + "</a>";
        paginationButtons.appendChild(li);
    }

    // Oculta todas las filas
    tabla.querySelectorAll("tbody tr").forEach(function (fila) {
        fila.style.display = "none";
    });

    // Calcula el rango de filas que se mostrarán
    var inicio = pagina * filasPorPagina;
    var fin = inicio + filasPorPagina;

    // Muestra las filas correspondientes
    tabla.querySelectorAll("tbody tr").forEach(function (fila, indice) {
        if (indice >= inicio && indice < fin) {
            fila.style.display = "";
        }
    });

    // Actualiza el estado activo del botón de paginación
    document.querySelectorAll("#" + tablaId + "PaginationButtons li").forEach(function (item) {
        item.classList.remove("active");
    });

    document.querySelector("#" + tablaId + "PaginationButtons li:nth-child(" + (pagina + 1) + ")").classList.add("active");
}

// Muestra las primeras filas y genera los botones de paginación al cargar la página para ambas tablas
generarBotonesYMostrarFilas("tablePrec1", 0);
generarBotonesYMostrarFilas("tablePrec2", 0);