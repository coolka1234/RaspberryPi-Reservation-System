import { useParams } from "react-router-dom";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";

function EditRoom() {
  const { roomNumber } = useParams();
  const isAddingNew = roomNumber == null;

  return (
    <PageWithBackButton>
      <h1>{isAddingNew ? "Dodawanie sali" : `Edycja sali ${roomNumber}`}</h1>
    </PageWithBackButton>
  );
}

export { EditRoom };
