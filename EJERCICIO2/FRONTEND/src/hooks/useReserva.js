import { useState, useEffect, useCallback } from "react";
import {
    obtenerMenu,
    obtenerReserva,
    agregarPlato,
    actualizarPorciones,
    eliminarPlato,
    confirmarReservaAPI,
} from "../services/api";

//Logica del Frontend
export function useReserva() {
    // Estados a utilizar
    const [menuActual, setMenuActual] = useState([]); 
    const [reserva, setReserva] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [total, setTotal] = useState(0);
    const [segundosRestantes, setSegundosRestantes] = useState(null);
    const [mensajeError, setMensajeError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
    const [cargando, setCargando] = useState(true);

    // Obtener datos del backend
    const cargarDatos = useCallback(async() => {

        //Consultar menu y reserva
        const [platos, datosReserva] = await Promise.all([
            obtenerMenu(),
            obtenerReserva(),
        ]);

        //Actualizar estados con la respuesta
        setMenuActual(platos);
        setReserva(datosReserva.itemsReservados ?? []);
        setSaldo(datosReserva.saldo ?? 0);
        setTotal(datosReserva.total ?? 0);
        setSegundosRestantes(datosReserva.segundosRestantes ?? null);

    }, []);

    // Cargar datos al iniciar aplicacion
    useEffect(() => {

        async function iniciarApp() {

            setCargando(true);

            try {
                await cargarDatos();
            } catch (error) {
                setMensajeError(error.message);
            } finally {
                setCargando(false);
            }
        }

        iniciarApp();
    }, [cargarDatos]);

    //Temporizador visual para la reserva
    useEffect(() => {
        //Si no hay reserva
        if (segundosRestantes === null) {
            return;
        }

        //Acabo el tiempo
        if (segundosRestantes <= 0) {
            async function verficarVencimiento() {
                try {
                    await cargarDatos();

                    setMensajeError("El tiempo de reserva termino. Consulta tu reserva para comenzar nuevamente");
                } catch (error) {
                    setMensajeError(error.message);
                }
            }

            verficarVencimiento();
            return;
        }

        //Descontar un segundo en la interfaz
        const temporizador = setTimeout(() => {
           setSegundosRestantes((anterior) => 
            anterior === null
             ? null
             : Math.max(0, anterior - 1)
        );
        }, 1000);

        //Limpiar temporizador
        return() => clearTimeout(temporizador);
    }, [segundosRestantes, cargarDatos]);

    //Funcion general para las operaciones 
    async function ejecutarOperacion(operacion, mensaje = "") {
        //Evitar operaciones simultaneas
        if (cargando) {
            return;
        }

        setCargando(true);
        setMensajeError("");
        setMensajeExito("");

        try {
            //Ejecutar operacion en Express
            await operacion();

            //Consultar datos actualizados
            await cargarDatos();

            if (mensaje) {
                setMensajeExito(mensaje);
            }

        } catch (error) {
            //Mostrar error enviado por Express
            setMensajeError(error.message);

            //Intentar sincronizar el estado tras el error
            try {
                await cargarDatos();
            } catch  {
                //Conservamos mensaje original
            }
        } finally {
            setCargando(false);
        }
    }

    // Agregar plato a reserva
    function agregarReserva(idPlato) {
        return ejecutarOperacion(
            () => agregarPlato(idPlato)
        );
    }

    //Aumentar cantidad
    function aumentarCantidad(item) {
        const nuevaCantidad = item.cantidad + 1;
        return ejecutarOperacion(
            () => actualizarPorciones(item.id, nuevaCantidad)
        );
    }

    //Disminuir cantidad
     function disminuirCantidad(item) {
        const nuevaCantidad = item.cantidad - 1;
        
        //Si queda en 0, lo eliminamos
        if (nuevaCantidad === 0) {
            return eliminarItem(item.id);
        }

        return ejecutarOperacion(
            () => actualizarPorciones(item.id, nuevaCantidad)
        );
    }

    //Eliminar un plato
    function eliminarItem(idPlato) {
        return ejecutarOperacion(
            () => eliminarPlato(idPlato)
        );
    }

    // Confirmar reserva
    function confirmarReserva() {
        if (reserva.length === 0) {
            return;
        }

        return ejecutarOperacion(
            () => confirmarReservaAPI(), 
            "!Tu reserva fue confirmada correctamente!"
        );
    }

    // Entregar datos y funciones a App.jsx
    return {
        menuActual,
        reserva,
        saldo,
        total,
        segundosRestantes,
        mensajeError,
        mensajeExito,
        cargando,

        agregarReserva,
        aumentarCantidad,
        disminuirCantidad,
        eliminarItem,
        confirmarReserva,
    };

}