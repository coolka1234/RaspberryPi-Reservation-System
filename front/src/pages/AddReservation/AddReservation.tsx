import { FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { formatDate } from "../../utils";

const MINUTES_IN_HOUR = 60;
const VALID_CUSTOM_VALIDTY = "";
const INVALID_CUSTOM_VALIDITY = "invalid";

const isHourCorrect = (hour: string): boolean => {
  const hourRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
  return hourRegex.test(hour);
};

const parseHourToMinutes = (hour: string): number => {
  if (!isHourCorrect(hour)) {
    throw new Error(`Invalid hour format: ${hour}`);
  }

  const [hours, minutes] = hour.split(":");
  return Number(hours) * MINUTES_IN_HOUR + Number(minutes);
};

function AddReservation() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const form = useRef<HTMLFormElement>(null);
  const startHourInput = useRef<HTMLInputElement>(null);
  const endHourInput = useRef<HTMLInputElement>(null);

  const [reservationDate, setReservationDate] = useState("");
  const [reservationStartHour, setReservationStartHour] = useState("");
  const [reservationEndHour, setReservationEndHour] = useState("");
  const [isAddBtnEnabled, setIsAddBtnEnabled] = useState(false);

  useEffect(() => {
    const isStartHourCorrect = isHourCorrect(reservationStartHour);
    startHourInput.current?.setCustomValidity(
      isStartHourCorrect ? VALID_CUSTOM_VALIDTY : INVALID_CUSTOM_VALIDITY
    );

    const isEndHourCorrect = isHourCorrect(reservationEndHour);
    endHourInput.current?.setCustomValidity(
      isEndHourCorrect ? VALID_CUSTOM_VALIDTY : INVALID_CUSTOM_VALIDITY
    );

    if (isStartHourCorrect && isEndHourCorrect) {
      const startMinutes = parseHourToMinutes(reservationStartHour);
      const endMinutes = parseHourToMinutes(reservationEndHour);

      const areHoursCorrect = startMinutes < endMinutes;
      startHourInput.current?.setCustomValidity(
        areHoursCorrect ? VALID_CUSTOM_VALIDTY : INVALID_CUSTOM_VALIDITY
      );
      endHourInput.current?.setCustomValidity(
        areHoursCorrect ? VALID_CUSTOM_VALIDTY : INVALID_CUSTOM_VALIDITY
      );
    }
  }, [reservationStartHour, reservationEndHour]);

  useEffect(() => {
    setIsAddBtnEnabled(form.current?.checkValidity() ?? false);
  }, [reservationDate, reservationStartHour, reservationEndHour]);

  if (roomId == null) {
    navigate("/");
  }

  const addReservation = (event: FormEvent): void => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      return;
    }

    console.log("added");
  };

  return (
    <PageWithBackButton>
      <h1>
        <span className="fw-bold">Rezerwacja</span> - sala {roomId}
      </h1>
      <Form
        ref={form}
        className="mt-5 p-5"
        validated={true}
        noValidate
        onSubmit={addReservation}>
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
              ref={startHourInput}
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
              ref={endHourInput}
              type="text"
              required
              placeholder="00:00"
              value={reservationEndHour}
              onChange={(event) => setReservationEndHour(event.target.value)}
            />
          </Col>
        </Form.Group>
        <div className="mt-5 d-flex justify-content-center">
          <Button type="submit" variant="success" disabled={!isAddBtnEnabled}>
            Zarezerwuj
          </Button>
        </div>
      </Form>
    </PageWithBackButton>
  );
}

export { AddReservation };
