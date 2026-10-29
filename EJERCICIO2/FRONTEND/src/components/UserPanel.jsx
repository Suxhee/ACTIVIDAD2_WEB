import { Alert, Badge } from "reactstrap";

//Saldo, total y temporizador


function UserPanel({ saldo, total, segundosRestantes }) {
  
  //Convertir tiempo a minutos y segundos
  const minutos = Math.floor((segundosRestantes ?? 0) / 60);
  const segundos = String((segundosRestantes ?? 0) % 60).padStart(2, "0");

  return (
    <Alert color="info">

      {/* Saldo del usuario */}
      <h5>
        Tu saldo actual:
        <Badge color="success" className="ms-2">
          ${saldo.toFixed(2)}
        </Badge>
      </h5>

      {/* Total de la reserva */}
      <h5 className="mt-2">
        Total de tu Reserva:
        <Badge color="dark" pill className="ms-2">
          ${total.toFixed(2)}
        </Badge>
      </h5>

      {/* Tiempo restante */}
      {segundosRestantes !== null && ( 
       <p className="mb-0 mt-3">
        Tiempo restante para confirmar: 
         <strong className="ms-2">
          {minutos}:{segundos}
         </strong>
       </p>)}

    </Alert>
  );
}

export default UserPanel;