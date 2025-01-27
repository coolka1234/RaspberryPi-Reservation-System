import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../utils";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";

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
    <PageWithBackButton>
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
              required
              min={formatDate(new Date())}
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
              required
              placeholder="00:00"
              value={reservationStartHour}
              onChange={(event) => setReservationStartHour(event.target.value)}
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
              required
              placeholder="00:00"
              value={reservationEndHour}
              onChange={(event) => setReservationEndHour(event.target.value)}
            />
          </Col>
        </Form.Group>
        <Button className="mt-5" type="submit" variant="success">
          Zarezerwuj
        </Button>
      </Form>
    </PageWithBackButton>
  );
}

export { AddReservation };
