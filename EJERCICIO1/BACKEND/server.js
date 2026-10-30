import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

//Estado del juego
const MIN = 1;
const MAX = 100;

//Generar un numero aleatorio entre MIN y MAX incluyendo a ambos
const generarNumero = () => Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

//numero generado
let numeroSecreto = generarNumero();
console.log(`Numero secreto inicial: ${numeroSecreto}`);

/*=============================================================
                         RUTAS
===============================================================*/

// POST/guess
app.post("/guess", (req, res)=> {
    const numero = req.body?.number;

    if(!Number.isInteger(numero) || numero < MIN || numero > MAX){
    return res
    .status(400)
    .json ({ mensaje: `ERROR: debes escribir un numero entero entre ${MIN} y ${MAX}` });
    }

    if (numero === numeroSecreto){
    return res.json({ resultado: "correcto", mensaje: "Haz adivinado el numero!! MUY BIEN :D"})
    }

    if (numeroSecreto > numero){
    return res.json({ resultado: "mayor", mensaje: "UPS! El numero secreto es mayor"}); 
    }
    return res.json ({resultado: "menor", mensaje: "UPS! El numero secreto es menor"});
});

// POST/reset
app.post("/reset", (req,res) =>{
   numeroSecreto = generarNumero();
   console.log(`Nuevo numero secreto: ${numeroSecreto}`);
   res.json({mensaje: "Haz reiniciado el juego! Ahora hay un nuevo numero que debes adivinar"});
});

app.listen(PORT, () => {
    console.log(`Esta corriendo el servidor del ejercicio 1 en http://localhost:${PORT} `);   
});