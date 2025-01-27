import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";

function AddReservation() {
  const { roomNumber } = useParams();
  const navigate = useNavigate();

  const [reservationDate, setReservationDate] = useState("");
  const [reservationStartHour, setReservationStartHour] = useState("");
  const [reservationEndHour, setReservationEndHour] = useState("");

  if (roomNumber == null) {
    navigate("/");
  }

  return (
    <>
      <Button
        className="btn btn-success position-absolute ms-4 mt-4"
        onClick={() => navigate("/")}>
        <ArrowLeft />
      </Button>
      <main className="h-100 p-4 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <h1>
            <span className="fw-bold">Rezerwacja</span> - sala {roomNumber}
          </h1>
          <Form className="mt-5 p-5">
            <Form.Group as={Row}>
              <Form.Label className="fw-bold" column sm="4">
                Data rezerwacji
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="date"
                  value={reservationDate}
                  onChange={(event) => setReservationDate(event.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group className="mt-3" as={Row}>
              <Form.Label className="fw-bold" column sm="4">
                Godziny rezerwacji
              </Form.Label>
              <Col sm="3">
                <Form.Control
                  type="text"
                  value={reservationStartHour}
                  onChange={(event) =>
                    setReservationStartHour(event.target.value)
                  }
                />
              </Col>
              <Col
                className="fw-bold text-center d-flex justify-content-center align-items-center"
                sm="2">
                -
              </Col>
              <Col sm="3">
                <Form.Control
                  type="text"
                  value={reservationEndHour}
                  onChange={(event) =>
                    setReservationEndHour(event.target.value)
                  }
                />
              </Col>
            </Form.Group>
            <Button className="mt-5" type="submit" variant="success">
              Zarezerwuj
            </Button>
          </Form>
        </div>
      </main>
    </>
  );
}

export { AddReservation };
