//Comunicacion con el Backend

const API_URL = "http://localhost:3002/api";

//Funcion general para las peticiones HTTP
async function peticion(ruta, opciones = {}) {
    let respuesta;

    try {
        respuesta = await fetch(`${API_URL}${ruta}`, {
            ...opciones,
            headers: {
                "Content-Type": "application/json",
                ...opciones.headers,
            },
        });
    } catch  {
        throw new Error("No se pudo conectar con el backend. Comprueba que Express este funcionando en el puerto 3002");
    }

    //Leer respuesta del servidor
    const texto = await respuesta.text();

    let datos = null;

    if (texto) {
        try {
            datos = JSON.parse(texto);
        } catch {
            datos = texto;
        }
    }

    //Si el servidor responde con error
    if (!respuesta.ok) {
        const mensaje = 
           datos && typeof datos === "object"
               ? datos.mensaje || datos.error : null;
            throw new Error(mensaje || `Error HTTP ${respuesta.status}`);
    }

    return datos;
}


// 1. Obtener MENU
export function obtenerMenu() {
    return peticion("/menu");
}

// 2. Obtener reserva actual
export function obtenerReserva() {
    return peticion("/reserva");
}

// 3. Agregar un plato
export function agregarPlato(alimentoId) {
    return peticion("/reserva/agregar", {
        method: "POST",
        body: JSON.stringify({
            alimentoId,
            cantidad: 1,
        }), 
    });
}

// 4. Actualizar porciones
export function actualizarPorciones(id, cantidad) {
    return peticion(
        `/reserva/actualizar-porciones/${id}`,
        {
            method: "PUT",
            body: JSON.stringify({ cantidad }),
        }
    );
}

//5. Eliminar un plato
export function eliminarPlato(id) {
    return peticion(`/reserva/eliminar/${id}`, 
        {
            method: "DELETE",
        }
    );
}

//Confirmar reserva 
//Ruta adicional: implementarla en Express
export function confirmarReservaAPI() {
    return peticion("/reserva/confirmar",
        {
            method: "POST",
        }
    );
}