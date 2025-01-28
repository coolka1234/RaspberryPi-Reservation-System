import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { API_URLS } from "../../constants";

function EditRoom() {
  const { roomId } = useParams();
  const isAddingNew = roomId == null;

  const form = useRef<HTMLFormElement>(null);

  const [equipment, setEquipment] = useState("");
  const [capacity, setCapacity] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isSaveBtnEnabled, setIsSaveBtnEnabled] = useState(false);

  useEffect(() => {
    setIsSaveBtnEnabled(form.current?.checkValidity() ?? false);
  }, [equipment, capacity, roomNumber]);

  const saveRoom = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      return;
    }

    const payload = {
      number: roomNumber,
      equipment,
      capacity: Number(capacity),
    };
    if (!isAddingNew) {
      payload.id = 3;
    }

    await fetch(API_URLS.Rooms, {
      method: isAddingNew ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  return (
    <PageWithBackButton>
      <h1>{isAddingNew ? "Dodawanie sali" : `Edycja sali ${roomId}`}</h1>
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

export { EditRoom };
