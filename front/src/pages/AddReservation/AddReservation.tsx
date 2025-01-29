import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchApi, queryFunctionFactory } from "../../api";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { API_URLS, FETCH_KEYS } from "../../constants";
import { useUser } from "../../contexts/AuthContext";
import { useShowErrorMessageBox } from "../../contexts/MessageBoxContext";
import { useShowToast } from "../../contexts/ToastContext";
import type { Room } from "../../models/Room";
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

  const user = useUser();

  const navigate = useNavigate();

  const showErrorMessageBox = useShowErrorMessageBox();
  const showToast = useShowToast();

  const form = useRef<HTMLFormElement>(null);
  const startHourInput = useRef<HTMLInputElement>(null);
  const endHourInput = useRef<HTMLInputElement>(null);

  const [reservationDate, setReservationDate] = useState("");
  const [reservationStartHour, setReservationStartHour] = useState("");
  const [reservationEndHour, setReservationEndHour] = useState("");
  const [isAddBtnEnabled, setIsAddBtnEnabled] = useState(false);

  const {
    isLoading,
    isError,
    data: room,
  } = useQuery<Room>({
    queryKey: [FETCH_KEYS.AddReservationRoom],
    queryFn: queryFunctionFactory(`${API_URLS.Rooms}/${roomId}`),
  });

  useEffect(() => {
    if (isError) {
      showErrorMessageBox();
    }
  }, [isError]);

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

  const addReservation = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      return;
    }

    try {
      await fetchApi(API_URLS.Reservations, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fk_room: roomId,
          fk_user: user?.id,
          start_date: `${reservationDate} ${reservationStartHour}`,
          end_date: `${reservationDate} ${reservationEndHour}`,
        }),
      });

      showToast("Salę zarezerwowano pomyślnie.");

      navigate("/");
    } catch {
      showErrorMessageBox();
    }
  };

  return (
    <PageWithBackButton>
      {isLoading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <>
          <h1>
            <span className="fw-bold">Rezerwacja</span> - sala {room?.number}
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
                  ref={endHourInput}
                  type="text"
                  required
                  placeholder="00:00"
                  value={reservationEndHour}
                  onChange={(event) =>
                    setReservationEndHour(event.target.value)
                  }
                />
              </Col>
            </Form.Group>
            <div className="mt-5 d-flex justify-content-center">
              <Button
                type="submit"
                variant="success"
                disabled={!isAddBtnEnabled}>
                Zarezerwuj
              </Button>
            </div>
          </Form>
        </>
      )}
    </PageWithBackButton>
  );
}

export { AddReservation };
