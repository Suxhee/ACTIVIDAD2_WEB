import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  Button,
} from "reactstrap";

function PlatoCard({ plato, agregarReserva, cargando }) {

  const agotado = plato.stock === 0;

  return (
    <Card className="mb-3 h-100">

      <CardBody>

        {/* Nombre del plato */}
        <CardTitle tag="h5">
          {plato.nombre}
        </CardTitle>

        {/* Categoría */}
        <CardText>
          Categoría: {plato.categoria}
        </CardText>

        {/* Precio */}
        <Badge color="success">
          ${plato.precio.toFixed(2)}
        </Badge>

        {/* Stock */}
        <p className="mt-3">
          Stock disponible: {plato.stock}
        </p>

        {/* Botón según stock */}
        {agotado ? (
          <Button color="secondary" disabled>
            Agotado
          </Button>
        ) : (
          <Button color="primary"
                  disabled={cargando}
                  onClick={() => agregarReserva(plato.id)} //al hacer click agrega la reserva
          >
            Añadir a la Reserva
          </Button>
        )}

      </CardBody>

    </Card>
  );
}

export default PlatoCard;