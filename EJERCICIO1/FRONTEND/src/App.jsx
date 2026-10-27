import { useState } from "react";
import "./App.css"

function App() {
  // Estado para almacenar los intentos realizados
  const [attempts, setAttempts] = useState([]); //Se inicializa con un array vacío para almacenar los intentos realizados

  //Estado para validar si el usuario ha ganado o perdido booleano
  const [gameStatus, setGameStatus] = useState(false); //Se inicializa con false para indicar que el juego no ha terminado

  // Estado para decir mayor, menor o correcto
  const [hint, setHint] = useState(""); //Se inicializa con un string vacío para mostrar la pista al usuario
  
  //estado para almacenar el valor del input del usuario
  const [userGuess, setUserGuess] = useState(""); //Se inicializa con un string vacío para almacenar el valor del input del usuario

  // Función para manejar el envío del formulario
  const enviarRespuesta = async (event) => {
  event.preventDefault();

  if (userGuess === "") {
    return;
  }

  const number = parseInt(userGuess); // lo convertimos una sola vez

  // Enviamos la respuesta al servidor con fetch y actualizamos el estado con la respuesta del servidor
  try {
    const respuesta = await fetch("http://localhost:3000/guess", { //VERIFICAR SI LA URL ES CORRECTA
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number }),
    });
    const datos = await respuesta.json();

    setHint(datos.result);
    setAttempts([...attempts, number]);
    setUserGuess("");

    if (datos.result === "correcto") {
      setGameStatus(true);
    }
  } catch (error) {
    setHint("No se pudo conectar con el servidor");
  }
};

const reiniciar = async () => {
  try {
    await fetch("http://localhost:3000/reset", { method: "POST" }); //VERIFICAR SI LA URL ES CORRECTA

    setAttempts([]);
    setGameStatus(false);
    setHint("");
    setUserGuess("");
  } catch (error) {
    setHint("No se pudo reiniciar el juego");
  }
};

    return (
      <div>
        <h1>Adivina el número</h1>
    <form onSubmit={enviarRespuesta}>
      <input
        type="number"
        value={userGuess}
        onChange={(e) => setUserGuess(e.target.value)}
            disabled={gameStatus}

      />
      <button type="submit" disabled={gameStatus}>Adivinar</button>
    </form>

    <p>{hint}</p>

    {gameStatus && <p>¡Ganaste en {attempts.length} intentos!</p>}
    <button onClick={reiniciar}>Reiniciar</button>

    {/* Mostrar la lista de intentos */}
    <ul>
      {attempts.map((attempt, index) => (
        <li key={index}>{attempt}</li>
      ))}
    </ul>

      </div>

    );
}

export default App;