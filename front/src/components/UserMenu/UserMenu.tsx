import { GearFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useLogOut, useUser } from "../../contexts/AuthContext";

function UserMenu() {
  const user = useUser();
  const logOut = useLogOut();
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center">
      <div>
        Zalogowano jako: <span className="fw-bold">{user?.username}</span>
      </div>
      {user?.type === "user" && (
        <button
          className="ms-3 btn btn-success"
          onClick={() => navigate("/my-reservations")}>
          Moje rezerwacje
        </button>
      )}
      {user?.type === "admin" && (
        <button
          className="ms-3 btn btn-success"
          onClick={() => navigate("/admin")}>
          <GearFill />
        </button>
      )}
      <button className="ms-3 btn btn-success" onClick={logOut}>
        Wyloguj
      </button>
    </div>
  );
}

export { UserMenu };
