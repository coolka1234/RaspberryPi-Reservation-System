import { useParams } from "react-router-dom";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { Button, Form } from "react-bootstrap";
import { API_URLS } from "../../constants";

function EditRoom() {
  const { roomNumber } = useParams();
  const isAddingNew = roomNumber == null;

  const saveRoom = async (event): Promise<void> => {
    event.preventDefault();

    await fetch(API_URLS.Rooms, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: "666",
        equipment: "Projector, Whiteboard",
        capacity: 20,
      }),
    });
  };

  return (
    <PageWithBackButton>
      <h1>{isAddingNew ? "Dodawanie sali" : `Edycja sali ${roomNumber}`}</h1>
      <Form onSubmit={saveRoom}>
        <Form.Group>
          <Form.Label>Sprzęt</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Liczba miejsc</Form.Label>
          <Form.Control type="number" min="1" />
        </Form.Group>
        <Button type="submit">Zapisz</Button>
      </Form>
    </PageWithBackButton>
  );
}

export { EditRoom };
