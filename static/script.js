document.addEventListener("DOMContentLoaded", function () {
    cargarJugadores();
    cargarEstadisticas();

    document.getElementById("formulario").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que la página se recargue
       
        let nombre = document.getElementById("nombre").value;
        let cedula = document.getElementById("cedula").value;
        let edad = document.getElementById("edad").value;
        let nacionalidad = document.getElementById("nacionalidad").value;

        agregarJugador(nombre, cedula, edad, nacionalidad);

        document.getElementById("nombre").value = "";
        document.getElementById("cedula").value = "";
        document.getElementById("edad").value = "";
        document.getElementById("nacionalidad").value = "";
    });

});

function agregarJugador(nombre, cedula, edad, nacionalidad) {
    fetch("/ingresar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cedula, edad, nacionalidad })
    })
    .then(response => response.json())
    .then(data => {
        alert("Jugador agregado correctamente");
        cargarJugadores(); 
        cargarEstadisticas();
    });
}

function cargarJugadores() {
    fetch("/mostrar")
    .then(response => response.json())
    .then(jugadores => {
        let tabla = document.getElementById("tabla-jugadores");
        tabla.innerHTML = ""; // Borra el contenido antes de actualizar

        jugadores.forEach(jugador => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${jugador.nombre}</td>
                <td>${jugador.cedula}</td>
                <td>${jugador.edad}</td>
                <td>${jugador.nacionalidad}</td>
                <td>
                    <button onclick="eliminarJugador(${jugador.cedula})">Eliminar</button>
                    <button onclick="actualizarJugador(${jugador.cedula})">Actualizar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    });
}

function eliminarJugador(cedula) {
    fetch("/eliminar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula })
    })
    .then(response => response.json())
    .then(data => {
        alert("Jugador eliminado");
        cargarJugadores();
        cargarEstadisticas();
    });
}

function actualizarJugador(cedula) {
    let nuevoNombre = prompt("Nuevo nombre:");
    let nuevaEdad = prompt("Nueva edad:");
    let nuevaNacionalidad = prompt("Nueva nacionalidad:");

    if (nuevoNombre && nuevaEdad && nuevaNacionalidad) {
        fetch("/actualizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cedula: cedula,
                nombre: nuevoNombre,
                edad: nuevaEdad,
                nacionalidad: nuevaNacionalidad
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Jugador actualizado");
            cargarJugadores();
            cargarEstadisticas();
        });
    }
}

function cargarEstadisticas() {
    fetch("/estadisticas")
    .then(response => response.json())
    .then(data => {
        document.getElementById("num-jugadores").textContent = data.num_jugadores;
        document.getElementById("promedio-edad").textContent = data.promedio_edad;
        document.getElementById("nacionalidad-mas-repetida").textContent = data.nacionalidad_mas_repetida;
    });
}
