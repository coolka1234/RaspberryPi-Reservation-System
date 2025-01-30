import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { API_URLS } from "../../constants";
import { useShowErrorMessageBox } from "../../contexts/MessageBoxContext";
import { useShowToast } from "../../contexts/ToastContext";
import type { RoomPayload } from "../../models/Room";

function AddRoom() {
  const showToast = useShowToast();
  const showErrorMessageBox = useShowErrorMessageBox();

  const navigate = useNavigate();

  const form = useRef<HTMLFormElement>(null);

  const [equipment, setEquipment] = useState("");
  const [capacity, setCapacity] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isSaveBtnEnabled, setIsSaveBtnEnabled] = useState(false);

  useEffect(() => {
    setIsSaveBtnEnabled(form.current?.checkValidity() ?? true);
  }, [equipment, capacity, roomNumber]);

  const saveRoom = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      return;
    }

    const payload: RoomPayload = {
      number: roomNumber,
      equipment,
      capacity: Number(capacity),
    };

    try {
      await fetch(API_URLS.Rooms, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showToast("Sala zapisana pomyślnie.");

      navigate("/");
    } catch {
      showErrorMessageBox();
    }
  };

  return (
    <PageWithBackButton>
      <h1>Dodawanie sali</h1>
      <Form
        ref={form}
        className="mt-5 p-5"
        validated={true}
        noValidate
        onSubmit={saveRoom}>
        <Form.Group as={Row}>
          <Form.Label className="fw-bold" column sm="4">
            Numer sali
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              required
              value={roomNumber}
              onChange={(event) => setRoomNumber(event.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group className="mt-3" as={Row}>
          <Form.Label className="fw-bold" column sm="4">
            Sprzęt
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="text"
              value={equipment}
              onChange={(event) => setEquipment(event.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group className="mt-3" as={Row}>
          <Form.Label className="fw-bold" column sm="4">
            Liczba miejsc
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="number"
              required
              min="0"
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
            />
          </Col>
        </Form.Group>
        <div className="mt-5 d-flex justify-content-center">
          <Button type="submit" variant="success" disabled={!isSaveBtnEnabled}>
            Zapisz
          </Button>
        </div>
      </Form>
    </PageWithBackButton>
  );
}

export { AddRoom };
