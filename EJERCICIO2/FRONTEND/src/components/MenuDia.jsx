import { Row, Col } from "reactstrap";
import PlatoCard from "./PlatoCard";

//Lista de platos: encargado de crear una tarjeta por cada plato
function MenuDia( {menu, agregarReserva, cargando} ) {

    return(
        <>
          <h2 className="mb-3">
            Menu del Dia
          </h2>

           <Row className="g-3">
            {menu.map((plato) => (
              <Col 
               xs="12"
               md="4"
               key={plato.id}
              >
                <PlatoCard plato={plato}
                           agregarReserva={agregarReserva}
                           cargando={cargando}>
                </PlatoCard>

              </Col>
            ))}
                
        </Row>
    </>
 );
}

export default MenuDia;