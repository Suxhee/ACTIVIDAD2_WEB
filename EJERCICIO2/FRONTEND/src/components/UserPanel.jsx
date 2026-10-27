import { Alert, Badge } from "reactstrap";

function UserPanel() {
  return (
    <Alert
      color="info"
      className="d-flex flex-wrap justify-content-between align-items-center shadow-sm mb-4"
    >

      {/* Saldo del usuario */}
      <h5 className="mb-0">
        Tu saldo actual:
        <Badge color="success" className="ms-2">
          $25.00
        </Badge>
      </h5>

      {/* Total de la reserva */}
      <h5 className="mb-0">
        Total de tu Reserva:
        <Badge color="dark" pill className="ms-2">
          $11.00
        </Badge>
      </h5>

    </Alert>
  );
}

export default UserPanel;