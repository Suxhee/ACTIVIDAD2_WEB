import {
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  Button,
  ButtonGroup,
} from "reactstrap";

function ReservaSidebar({ reserva }) {
  return (
    <Card className="shadow-sm">

      <CardBody>

        <h4 className="mb-3">Tu Reserva</h4>

        {reserva.length === 0 && (
          <p className="text-muted mb-0">Aún no has agregado platos.</p>
        )}

        <ListGroup flush>

          {reserva.map((item) => (

            <ListGroupItem key={item.id} className="px-0">

              <strong className="d-block mb-2">{item.nombre}</strong>

              <div className="d-flex justify-content-between align-items-center">

                {/* Control visual */}
                <ButtonGroup size="sm">

                  <Button color="secondary">
                    -
                  </Button>

                  <Button color="light" disabled className="px-3">
                    {item.cantidad}
                  </Button>

                  <Button color="secondary">
                    +
                  </Button>

                </ButtonGroup>

                <Button color="danger" outline size="sm">
                  Quitar
                </Button>

              </div>

            </ListGroupItem>

          ))}

        </ListGroup>

      </CardBody>

    </Card>
  );
}

export default ReservaSidebar;