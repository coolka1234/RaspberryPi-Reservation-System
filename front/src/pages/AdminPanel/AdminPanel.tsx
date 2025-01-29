import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <PageWithBackButton>
      <h1>Panel administratora</h1>
      <div className="mt-5">
        <Button variant="success" onClick={() => navigate("/add-room")}>
          Dodaj salę
        </Button>
      </div>
    </PageWithBackButton>
  );
}

export { AdminPanel };
