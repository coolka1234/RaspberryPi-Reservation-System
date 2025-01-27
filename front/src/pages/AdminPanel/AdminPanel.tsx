import { Button } from "react-bootstrap";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <PageWithBackButton>
      <h1>Panel administratora</h1>
      <div className="mt-5">
        <Button variant="success" onClick={() => navigate("/edit-room")}>
          Dodaj salę
        </Button>
      </div>
    </PageWithBackButton>
  );
}

export { AdminPanel };
