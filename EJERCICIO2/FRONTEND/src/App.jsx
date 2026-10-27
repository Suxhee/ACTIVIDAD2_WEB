import { Container, Row, Col, UncontrolledAlert } from "reactstrap";
import { useState } from "react";

import UserPanel from "./components/UserPanel";
import PlatoCard from "./components/PlatoCard";
import ReservaSidebar from "./components/ReservaSidebar";

import { menu, reservaDemo } from "./data";

function App() {
  const [saldo, setSaldo] = useState(25); //valor inicial --> $25
  const [menuActual, setMenuActual] = useState(menu); //valor inicial -> arreglo menu
  const [reserva, setReserva] = useState(reservaDemo); //valor inicial -> arreglo reservaDemo
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);
  //Para calcular el precio total
  const total = reserva.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );
  //Saldo restante
  const saldoRestante = saldo - total;

  /* para el Boton agregarReserva */
  function agregarReserva(idPlato){
    //Para buscar el plato
    const platoSeleccionado = menuActual.find(
      (plato) => plato.id === idPlato
    );

    //Coprobar existencia o que tenga stock
    if (!platoSeleccionado){
      return;
    }

    if (platoSeleccionado.stock <= 0) {
      return;
    }

    //Comprobar saldo disponible
    if(total + platoSeleccionado.precio > saldo){
      setMensajeError("Saldo insuficiente para esta cantidad");
      return;
    }

    setMensajeError("");

    //Descontar en el stock
    setMenuActual((menuAnterior) => 
      menuAnterior.map((plato) =>
      plato.id === idPlato ? {...plato, stock: plato.stock - 1}
    : plato
  ));

    //Para actualizar la reserva
    setReserva((reservaAnterior) => {
      const existe = reservaAnterior.find(
        (item) => item.id === idPlato
      );

      //Aumenta su cantidad en uno si ya hay existencias
      if (existe){
        return reservaAnterior.map((item) => 
        item.id === idPlato ? {...item, cantidad: item.cantidad + 1} : item
      );
      }

      //Añadimos el nuevo objeto
      return [
        ...reservaAnterior,
        {
          id: platoSeleccionado.id,
          nombre: platoSeleccionado.nombre,
          precio: platoSeleccionado.precio,
          cantidad: 1,
        },
      ];
    });
  }

  /* Funcionamiento de botones de ReservaSidebar */
  function aumentarCantidad(idPlato){
    agregarReserva(idPlato);
  }

  function disminuirCantidad(idPlato){
    const item = reserva.find((item) => item.id === idPlato);

    if(!item){
      return;
    }

    //Quitar el plato si solo queda una unidad
    if(item.cantidad === 1){
      setReserva((reservaAnterior) => 
        reservaAnterior.filter((item) => item.id !== idPlato)
    );
    } else {
      //si hay varias unidades, restamos una
      setReserva((reservaAnterior) =>
        reservaAnterior.map((item) =>
          item.id === idPlato ? {...item, cantidad: item.cantidad -1}
          : item
        )
      );
    }

    //Devolver lo eliminado
    setMenuActual((menuAnterior) =>
     menuAnterior.map((plato)  => 
      plato.id === idPlato ? {...plato, stock: plato.stock + 1}
      : plato
    )
  );
}


  function eliminarItem(idPlato) {
    const item = reserva.find((item) => item.id === idPlato);


    if(!item) {
      return;
    }

    console.log("Plato eliminado: ", item.nombre);
    console.log("Cantidad reservada: ", item.cantidad);

    //Eliminar plato de la reserva
    setReserva((reservaAnterior) =>
      reservaAnterior.filter((item) => item.id !== idPlato)
    );

  //Devolver unidades a stock
  setMenuActual((menuAnterior) =>
    menuAnterior.map((plato) => 
     plato.id === idPlato ? {...plato, stock: plato.stock + item.cantidad}
     : plato
    )
  );

  }


  return (
    <Container className="mt-4">

      {/* Panel superior */}
      <UserPanel saldo={saldoRestante} total={total} />

      {mensajeError && (
        <UncontrolledAlert color="warning">
          {mensajeError}
        </UncontrolledAlert>
      )}

      {cargando && (
        <UncontrolledAlert color="info">
          Cargando...
        </UncontrolledAlert>
      )}

      <Row>

        {/* Menú del día */}
        <Col xs="12" md="8">

          <h2 className="mb-3">
            Menú del Día
          </h2>

          <Row>

            {menuActual.map((plato) => ( //menuActual -> conectar estado con interfaz

              <Col
                xs="12"
                md="6"
                lg="4"
                key={plato.id}
              >
                <PlatoCard plato={plato}
                           agregarReserva={agregarReserva} /> 
              </Col>

            ))}

          </Row>

        </Col>

        {/* Reserva lateral */}
        <Col xs="12" md="4">

          <ReservaSidebar
            reserva={reserva}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            eliminarItem={eliminarItem} //reserva -> conectar estado con interfaz
          />

        </Col>

      </Row>

    </Container>
  );
}

export default App;