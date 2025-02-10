
document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const cedula = document.getElementById('cedula').value;
    const edad = document.getElementById('edad').value;
    const nacionalidad = document.getElementById('nacionalidad').value;

    // Crear el objeto que se enviará a la API
    const datos = {
        nombre: nombre,
        cedula: cedula,
        edad: edad,
        nacionalidad: nacionalidad
    };

    // Realizar una solicitud POST usando fetch para agregar un nuevo jugador
    fetch('/ingresar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)  // Convertir el objeto a JSON
    })
        .then(response => response.json())
        .then(data => {
            alert('Jugador ingresado correctamente');
            document.getElementById('formulario').reset();  // Limpiar el formulario
            location.reload();  // Recargar la página para ver la tabla actualizada
        })
        .catch(error => {
            alert('Hubo un error al enviar los datos');
            console.error('Error:', error);
        });
});

// Función para eliminar un jugador
function eliminarJugador(cedula) {
    fetch('/eliminar', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cedula: cedula })  // Enviar la cédula del jugador a eliminar
    })
        .then(response => response.json())
        .then(data => {
            alert('Jugador eliminado correctamente');
            location.reload();  // Recargar la página para ver la tabla actualizada
        })
        .catch(error => {
            alert('Hubo un error al eliminar el jugador');
            console.error('Error:', error);
        });
}

// Función para actualizar un jugador
function actualizarJugador(cedula) {
    // Poblar el formulario con los datos actuales del jugador
    const tr = document.querySelector(`tr[data-cedula='${cedula}']`);
    const nombre = tr.querySelector('.nombre').textContent;
    const edad = tr.querySelector('.edad').textContent;
    const nacionalidad = tr.querySelector('.nacionalidad').textContent;

    document.getElementById('nombre').value = nombre;
    document.getElementById('cedula').value = cedula;
    document.getElementById('edad').value = edad;
    document.getElementById('nacionalidad').value = nacionalidad;

    // Cambiar el evento del formulario para hacer una solicitud PUT
    document.getElementById('formulario').addEventListener('submit', function (event) {
        event.preventDefault();  // Evitar el envío tradicional

        const updatedNombre = document.getElementById('nombre').value;
        const updatedEdad = document.getElementById('edad').value;
        const updatedNacionalidad = document.getElementById('nacionalidad').value;

        // Crear el objeto que se enviará a la API
        const updatedData = {
            nombre: updatedNombre,
            cedula: cedula,  // Mantener la cédula para identificar al jugador
            edad: updatedEdad,
            nacionalidad: updatedNacionalidad
        };

        fetch('/actualizar', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)  // Enviar los datos modificados a la API
        })
            .then(response => response.json())
            .then(data => {
                alert('Jugador actualizado correctamente');
                document.getElementById('formulario').reset();  // Limpiar el formulario
                location.reload();  // Recargar la página para ver la tabla actualizada
            })
            .catch(error => {
                alert('Hubo un error al actualizar el jugador');
                console.error('Error:', error);
            });
    });
}

// Agregar los eventos a los botones de eliminar y actualizar al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const eliminarButtons = document.querySelectorAll('.btn_eliminar');
    eliminarButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const cedula = button.closest('tr').querySelector('.cedula').textContent;
            eliminarJugador(cedula);
        });
    });

    const actualizarButtons = document.querySelectorAll('.btn_actualizar');
    actualizarButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const cedula = button.closest('tr').querySelector('.cedula').textContent;
            actualizarJugador(cedula);
        });
    });
});
