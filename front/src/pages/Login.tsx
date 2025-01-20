import { LoginBox } from "../components/LoginBox/LoginBox";
import { Logo } from "../components/Logo/Logo";

function Login() {
  return (
    <div className="h-100 d-flex flex-column justify-content-around align-items-center">
      <Logo />
      <LoginBox />
    </div>
  );
}

export { Login };
