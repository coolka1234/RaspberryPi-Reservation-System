import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { queryFunctionFactory } from "../../api";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { API_URLS, FETCH_KEYS } from "../../constants";
import { useShowErrorMessageBox } from "../../contexts/MessageBoxContext";
import { useShowToast } from "../../contexts/ToastContext";
import type { Room } from "../../models/Room";

function EditRoom() {
  const { roomId } = useParams();

  const showToast = useShowToast();
  const showErrorMessageBox = useShowErrorMessageBox();

  const {
    isLoading,
    isError,
    data: room,
    refetch,
    isRefetching,
    isRefetchError,
  } = useQuery<Room>({
    queryKey: [FETCH_KEYS.Room],
    queryFn: queryFunctionFactory(`${API_URLS.Rooms}/${roomId}`),
  });

  useEffect(() => {
    if (isError || isRefetchError) {
      showErrorMessageBox();
    }
  }, [isError, isRefetchError]);

  useEffect(() => {
    if (room) {
      setEquipment(room.equipment);
      setCapacity(String(room.capacity));
      setRoomNumber(String(room.number));
    }
  }, [room]);

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

    const payload: Room = {
      id: Number(roomId),
      number: roomNumber,
      equipment,
      capacity: Number(capacity),
    };

    try {
      await fetch(API_URLS.Rooms, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showToast("Sala zapisana pomyślnie.");

      refetch();
    } catch {
      showErrorMessageBox();
    }
  };

  return (
    <PageWithBackButton>
      {isLoading || isRefetching ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <>
          <h1>Edycja sali {room?.number}</h1>
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
              <Button
                type="submit"
                variant="success"
                disabled={!isSaveBtnEnabled}>
                Zapisz
              </Button>
            </div>
          </Form>
        </>
      )}
    </PageWithBackButton>
  );
}

export { EditRoom };
