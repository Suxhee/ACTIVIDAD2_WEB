import express from "express";
import cors from "cors";

const app = express();
const PORT = 3002;

const SALDO_MENSUAL_INICIAL = 36.0; //Saldo de almuerzo del usuario
const DURACION_RESERVA_MS = 5 * 60 * 1000; //Limite de tiempo (5 minutos)

//    DATOS EN MEMORIA

// Inventario de platillos 
const menuInicial = () => [
    { id: 101, nombre: "Menu Ejecutivo (Pollo)", precio: 5.5, stock: 12, categoria: "Fuerte" },
    { id: 102, nombre: "Pasta Alfredo", precio: 4.75, stock: 10, categoria: "Fuerte" },
    { id: 103, nombre: "Pupusas (3 unidades)", precio: 3.0, stock: 15, categoria: "Tipico" },
    { id: 104, nombre: "Ensalada Fresca", precio: 2.5, stock: 8, categoria: "Entrada" },
    { id: 105, nombre: "Sopa de tortilla", precio: 3.75, stock: 6, categoria: "Entrada" },
    { id: 106, nombre: "Flan de Caramelo", precio: 1.75, stock: 5, categoria: "Postre" },
    { id: 107, nombre: "Limonada", precio: 1.25, stock: 20, categoria: "Bebida" },
    { id: 108, nombre: "Carne asada", precio: 6.0, stock: 10, categoria: "Fuerte" },
];

let menu = menuInicial();

let saldoMensual = SALDO_MENSUAL_INICIAL; //Saldo del usuario (Solo baja cuando confirma la reserva)
let reserva = { items: [], inicio: null }; //{id, cantidad} + momento en que inicio la reserva
let temporizador = null; //Control del limite de tiempo
let reservaExpirada = false; //Avisa al request que la reserva se cerro

//      FUNCIONES AUXILIARES

const redondear = (numero) => Math.round(numero * 100) / 100; //Evita errores de decimales 
const buscarAlimento = (id) => menu.find((alimento) => alimento.id === id);
const buscarItemReserva = (id) => reserva.items / find((item) => item.id === id);

//Suma precio * cantidad de todos los items de la reserva 
const calcularTotal = () => redondear(reserva.items.reduce((acumulado, item) => {
    const alimento = buscarAlimento(item.id);
    return acumulado + alimento.precio * item.cantidad;
}, 0)
);

//Armar el objeto que se le devuelve al frontend
const construirReserva = () => {
    const total = calcularTotal();
    const segundosRestantes =
        reserva.inicio ? Math.max(0, Math.ceil((reserva.inicio + DURACION_RESERVA_MS - Date.now()) / 1000)) : null;

    return {
        saldo: redondear(saldoMensual - total), //descontar del saldo disponible
        itemsReservados: reserva.items.map((item) => {
            const alimento = buscarAlimento(item.id);
            return { id: item.id, nombre: alimento.nombre, precio: alimento.precio, cantidad: item.cantidad };
        }),
        total, segundosRestantes, //null si no hay reserva activa
    };
};

//Temporizador de la reserva
const detenerTemporizador = () => {
    clearTimeout(temporizador);
    temporizador = null;
    reserva.inicio = null;
};

//Devuelve todas las porciones al stock y vacia la reserva
const liberarReserva = () => {
    reserva.items.forEach((item) => {
        const alimento = buscarAlimento(item.id);
        alimento.stock += item.cantidad;
    });
    reserva.items = [];
    detenerTemporizador();
};

//Iniciar temporizador: Se inicia al agregar el primer platillo; al vencer, se cierra la reserva

const iniciarTemporizador = () => {
    if (temporizador) return; //Ya hay una reserva corriendo
    reserva.inicio = Date.now();
    temporizador = setTimeout(() => {
        liberarReserva();
        reservaExpirada = true;
        console.log("[INFO] La reserva expiró y se liberó el stock");
    }, DURACION_RESERVA_MS);
};
