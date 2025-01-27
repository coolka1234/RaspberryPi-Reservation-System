import { Button } from "react-bootstrap";
import { GearFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useLogOut, useUser } from "../../contexts/AuthContext";
import { USER_ROLE } from "../../models/User";

function UserMenu() {
  const user = useUser();
  const logOut = useLogOut();
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center">
      <div>
        Zalogowano jako: <span className="fw-bold">{user?.username}</span>
      </div>
      {user?.type === USER_ROLE.User && (
        <Button
          className="ms-3"
          variant="success"
          onClick={() => navigate("/my-reservations")}>
          Moje rezerwacje
        </Button>
      )}
      {user?.type === USER_ROLE.Admin && (
        <Button
          className="ms-3"
          variant="success"
          onClick={() => navigate("/admin")}>
          <GearFill />
        </Button>
      )}
      <Button className="ms-3" variant="success" onClick={logOut}>
        Wyloguj
      </Button>
    </div>
  );
}

export { UserMenu };
