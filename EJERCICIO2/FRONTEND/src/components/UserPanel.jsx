import { Alert, Badge } from "reactstrap";

function UserPanel({ saldo, total }) {
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

    </Alert>
  );
}

export default UserPanel;