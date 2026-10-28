import { Container,
         Row, 
         Col, 
         Alert,
         UncontrolledAlert,
} from "reactstrap";

import UserPanel from "./components/UserPanel";
import MenuDia from "./components/MenuDia";
import ReservaSidebar from "./components/ReservaSidebar";

import { useReserva } from "./hooks/useReserva";

function App() {
  //Obtener dtos y funciones de hooks
  const {
    menuActual,
    reserva,
    saldo,
    total,
    segundosRestantes,

    mensajeError,
    mensajeExito,
    cargando,

    agregarReserva,
    aumentarCantidad,
    disminuirCantidad,
    eliminarItem,
    confirmarReserva,

  } = useReserva();
  

  return (
    <Container className="mt-4 mb-5">

      {/* Titulo */}
      <h1 className="mb-4">
        Food DEI
      </h1>

      {/* Panel superior */}
      <UserPanel 
        saldo={saldo} 
        total={total} 
        segundosRestantes={segundosRestantes}/>

      {mensajeError && (
        <UncontrolledAlert color="warning">
          {mensajeError}
        </UncontrolledAlert>
      )}

      {mensajeExito && (
        <Alert color="success">
          {mensajeExito}
        </Alert>
      )}

      {cargando && (
        <Alert color="info">
          Cargando...
        </Alert>
      )}

      <Row className="mt-4">

        {/* Menú del día */}
        <Col xs="12" md="8">
         
         <MenuDia 
           menu={menuActual}
           agregarReserva={agregarReserva}
           cargando={cargando}>
           </MenuDia>

        </Col>

        {/* Reserva lateral */}
        <Col xs="12" md="4">

          <ReservaSidebar
            reserva={reserva}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            eliminarItem={eliminarItem} //reserva -> conectar estado con interfaz
            confirmarReserva={confirmarReserva}
            cargando={cargando}
          />

        </Col>

      </Row>

    </Container>
  );
}

export default App;