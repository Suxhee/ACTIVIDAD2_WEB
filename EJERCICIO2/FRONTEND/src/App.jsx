import { Container, Row, Col } from "reactstrap";

import UserPanel from "./components/UserPanel";
import PlatoCard from "./components/PlatoCard";
import ReservaSidebar from "./components/ReservaSidebar";

import { menu, reservaDemo } from "./data";

function App() {
  return (
    <Container className="mt-4">

      {/* Panel superior */}
      <UserPanel />

      <Row>

        {/* Menú del día */}
        <Col xs="12" md="8">

          <h2 className="mb-3">
            Menú del Día
          </h2>

          <Row>

            {menu.map((plato) => (

              <Col
                xs="12"
                md="6"
                lg="4"
                key={plato.id}
              >
                <PlatoCard plato={plato} />
              </Col>

            ))}

          </Row>

        </Col>

        {/* Reserva lateral */}
        <Col xs="12" md="4">

          <ReservaSidebar
            reserva={reservaDemo}
          />

        </Col>

      </Row>

    </Container>
  );
}

export default App;