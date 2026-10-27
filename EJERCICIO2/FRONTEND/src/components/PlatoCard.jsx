import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  Button,
} from "reactstrap";

function PlatoCard({ plato }) {
  const agotado = plato.stock === 0;

  return (
    <Card className="mb-3 h-100 shadow-sm">

      <CardBody className="d-flex flex-column">

        {/* Nombre del plato */}
        <CardTitle tag="h5" className="mb-1">
          {plato.nombre}
        </CardTitle>

        {/* Categoría */}
        <CardText className="text-muted small mb-2">
          {plato.categoria}
        </CardText>

        {/* Precio */}
        <div className="mb-2">
          <Badge color="success" className="fs-5">
            ${plato.precio.toFixed(2)}
          </Badge>
        </div>

        {/* Stock */}
        <p className={`mb-3 ${agotado ? "text-danger" : "text-muted"}`}>
          Stock disponible: <strong>{plato.stock}</strong>
        </p>

        {/* Botón según stock (siempre pegado abajo) */}
        {agotado ? (
          <Button color="secondary" disabled className="mt-auto w-100">
            Agotado
          </Button>
        ) : (
          <Button color="primary" className="mt-auto w-100">
            Añadir a la Reserva
          </Button>
        )}

      </CardBody>

    </Card>
  );
}

export default PlatoCard;