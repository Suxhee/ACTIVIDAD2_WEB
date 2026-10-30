import express from "express";
import cors from "cors";

const app = express();
const PORT = 3002;

// Permitir peticiones desde React (Vite) y leer cuerpos JSON.
app.use(cors());
app.use(express.json());

const SALDO_MENSUAL_INICIAL = 36.0; //Saldo de almuerzo del usuario
const DURACION_RESERVA_MS = 5 * 60 * 1000; //Limite de tiempo (5 minutos)

/*=============================================================
                       DATOS EN MEMORIA
===============================================================*/   

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


/*=============================================================
                    FUNCIONES AUXILIARES
===============================================================*/   
const redondear = (numero) => Math.round(numero * 100) / 100; //Evita errores de decimales 
const buscarAlimento = (id) => menu.find((alimento) => alimento.id === id);
const buscarItemReserva = (id) => reserva.items.find((item) => item.id === id);

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
        console.log("La reserva expiro y se libero el stock");
    }, DURACION_RESERVA_MS);
};

/*=============================================================
                        MIDDLEWARE
===============================================================*/

//Cuando la reserva expira, se le aviso al usuario (1 vez)
app.use("/api/reserva", (req, res, next) => {
   if(reservaExpirada) {
    reservaExpirada = false;
    // Las lecturas deben poder sincronizar la interfaz tras la expiracion.
    if (req.method !== "GET") {
      return res.status(410).json({
          mensaje: "Se acabo el tiempo! Se cerro la reserva, inicia una nueva.",
      });
    }
   }
   next();
});

/*=============================================================
                         RUTAS
===============================================================*/

// RUTA 1: GET/api/menu
app.get("/api/menu", (req, res) => {
    res.json(menu);
});

// RUTA 2: GET/api/reserva
app.get("/api/reserva", (req, res) => {
    res.json(construirReserva());
});

// RUTA 3: POST/api/reserva/agregar
app.post("/api/reserva/agregar", (req,res) => {
   const alimentoId = Number(req.body.alimentoId);
   const cantidad = Number(req.body.cantidad);

   const alimento = buscarAlimento(alimentoId);
   if (!alimento) {
    return res.status(400).json({mensaje: "El platillo no existe"});
   }

   if(!Number.isInteger(cantidad) || cantidad < 1){
    return res.status(400).json({mensaje: "La cantidad deber ser un entero mayor a 0"});
   }

   // validacion para stock
   if(alimento.stock < cantidad){
    return res.status(400).json({mensaje: "Stock insuficiente."});
   }

   //validacion para saldo del cleinte
   if(calcularTotal() + alimento.precio * cantidad > saldoMensual) {
    return res.status(400).json({mensaje: "Saldo insuficiente para esta cantidad"});
   }
   alimento.stock -= cantidad;

   const itemExistente = buscarItemReserva(alimentoId);
   if (itemExistente){
    itemExistente.cantidad += cantidad;
   } else {
    reserva.items.push({id: alimentoId, cantidad});
   }

   iniciarTemporizador();
   res.json(construirReserva());
});

// RUTA 4: PUT/api/reserva/actualizar-porciones/:id
app.put("/api/reserva/actualizar-porciones/:id", (req, res) => {
  const id = Number(req.params.id);
  const nuevaCantidad = Number(req.body.cantidad);

  const item = buscarItemReserva(id);
  if (!item) {
    return res.status(404).json({ mensaje: "Ese plato no esta en tu reserva" });
  }

  if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 0) {
    return res.status(400).json({ mensaje: "Hubo un problema! La cantidad debe ser un entero mayor o igual a 0" });
  }

  const alimento = buscarAlimento(id);
  const diferencia = nuevaCantidad - item.cantidad;

  if (diferencia > 0) {
    // validacion para stock
    if (alimento.stock < diferencia) {
      return res.status(400).json({ mensaje: "Stock insuficiente" });
    }
    // validacin para el saldo
    if (calcularTotal() + alimento.precio * diferencia > saldoMensual) {
      return res.status(400).json({ mensaje: "Saldo insuficiente para esta cantidad" });
    }
  }
  alimento.stock -= diferencia;

  if (nuevaCantidad === 0) {
    reserva.items = reserva.items.filter((i) => i.id !== id);
    if (reserva.items.length === 0) detenerTemporizador();
  } else {
    item.cantidad = nuevaCantidad;
  }
  res.json(construirReserva());
});

// RUTA 5: DELETE/api/reserva/eliminar/:id
app.delete("/api/reserva/eliminar/:id", (req, res) => {
  const id = Number(req.params.id);

  const item = buscarItemReserva(id);
  if (!item) {
    return res.status(404).json({ mensaje: "Oh oh! Ese plato no esta en tu reserva" });
  }

  const alimento = buscarAlimento(id);
  alimento.stock += item.cantidad;
  reserva.items = reserva.items.filter((i) => i.id !== id);

  if (reserva.items.length === 0) detenerTemporizador();
  res.json(construirReserva());
});

//RUTA 6: POST/api/reserva/confirmar
app.post("/api/reserva/confirmar", (req, res) => {
  if (reserva.items.length === 0) {
    return res.status(400).json({ mensaje: "No podemos proceder tu solicitud, ya que tu reserva esta vacia" });
  }

  const total = calcularTotal();
  saldoMensual = redondear(saldoMensual - total);
  reserva.items = [];
  detenerTemporizador();

  res.json({ mensaje: `Reserva confirmada! por $${total.toFixed(2)}`, ...construirReserva() });
});

/* RUTA OPCIONAL
Solo para resetear el sistema desde cero luego de las pruebas*/
app.post("/api/reset-demo", (req, res) => {
  menu = menuInicial();
  saldoMensual = SALDO_MENSUAL_INICIAL;
  reserva.items = [];
  detenerTemporizador();
  reservaExpirada = false;
  res.json({ mensaje: "Los datos han sido reiniciados" });
});


app.use((err, req, res, next) => {
  res.status(400).json({ mensaje: "Solicitud invalida" });
});

app.listen(PORT, () => {
  console.log(`Esta corriendo el servidor del ejericio 2 en http://localhost:${PORT}`);
});