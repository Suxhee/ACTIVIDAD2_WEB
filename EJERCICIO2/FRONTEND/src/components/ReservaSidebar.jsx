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
}) {
  return (
    <Card>

      <CardBody>

        <h4>Tu Reserva</h4>

        <ListGroup>

          {reserva.map((item) => (

            <ListGroupItem key={item.id}>

              <strong>{item.nombre}</strong>

              <div className="mt-2">

                {/* Control visual */}
                <ButtonGroup size="sm">

                  <Button 
                  color="secondary"
                  onClick={() => disminuirCantidad(item.id)}>
                    -
                  </Button>

                  <Button color="light">
                    {item.cantidad}
                  </Button>

                  <Button 
                  color="secondary"
                  onClick={() => aumentarCantidad(item.id)}>
                    +
                  </Button>

                </ButtonGroup>

              </div>

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

      </CardBody>

    </Card>
  );
}

export default ReservaSidebar;