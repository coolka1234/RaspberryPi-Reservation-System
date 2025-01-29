import { Navigate } from "react-router-dom";
import { LoginBox } from "../../components/LoginBox/LoginBox";
import { Logo } from "../../components/Logo/Logo";
import { useUser } from "../../contexts/AuthContext";

function Login() {
  const user = useUser();

  if (user != null) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-100 d-flex flex-column justify-content-around align-items-center">
      <Logo />
      <LoginBox />
    </div>
  );
}

export { Login };
