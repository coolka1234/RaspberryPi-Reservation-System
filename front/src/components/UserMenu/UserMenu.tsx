import { useLogOut } from "../../contexts/AuthContext";

function UserMenu() {
  const logOut = useLogOut();

  return (
    <div className="d-flex align-items-center">
      <div>
        Zalogowano jako: <span className="fw-bold">user</span>
        <button className="ms-3 btn btn-success" onClick={logOut}>
          Wyloguj
        </button>
      </div>
    </div>
  );
}

export { UserMenu };
