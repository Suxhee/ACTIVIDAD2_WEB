import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

//Estado del juego
const MIN = 1;
const MAX = 100;

//Generar un numero aleatorio entre MIN y MAX incluyendo a ambos
const generarNumero = () => Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

//numero generado
let numeroSecreto = generarNumero();
console.log(`[DEBUG] Número secreto inicial: ${numeroSecreto}`);