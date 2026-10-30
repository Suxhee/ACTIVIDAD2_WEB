import {
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  Button,
  ButtonGroup,
} from "reactstrap";

function ReservaSidebar({ 
  reserva,
  aumentarCantidad,
  disminuirCantidad,
  eliminarItem, 
  confirmarReserva,
  cargando,
}) {
  return (
    <Card>

      <CardBody>

        <h4>Tu Reserva</h4>

        {/* Mensaje si no hay platos */}
        {reserva.length === 0 && (
          <p className="text-muted">
            Todavia no tienes platos reservados.
          </p>
        )}
        
        <ListGroup>

          {reserva.map((item) => (

            <ListGroupItem key={item.id}>

              <strong>{item.nombre}</strong>

              <p className="mb-2">
                ${item.precio.toFixed(2)} c/u
              </p>

              <ButtonGroup size="sm">
                 <Button
                   color="secondary"
                   disabled={cargando}
                   onClick={() => disminuirCantidad(item)}>
                    -
                   </Button>

                   <Button color="light" disabled>
                    {item.cantidad}
                   </Button>

                   <Button
                   color="secondary"
                   disabled={cargando}
                   onClick={() => aumentarCantidadCantidad(item)}>
                    +
                   </Button>

              </ButtonGroup>

              <p className="mt-2 mb-1">
                subtotal: $
                {(item.precio * item.cantidad).toFixed(2)}
              </p>

              <Button
                color="danger"
                outline
                size="sm"
                className="mt-2"
                onClick={() => eliminarItem(item.id)}
                
              >
                Quitar
              </Button>

            </ListGroupItem>

          ))}

        </ListGroup>

        <Button
          color="success"
          className="mt-3 w-100"
          disabled={cargando || reserva.length === 0}
          onClick={confirmarReserva}
        >
          Confirmar reserva
        </Button>

      </CardBody>

    </Card>
  );
}

export default ReservaSidebar;