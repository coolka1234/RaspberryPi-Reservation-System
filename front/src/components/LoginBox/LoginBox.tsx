import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogIn } from "../../contexts/AuthContext";
import "./LoginBox.css";

function LoginBox() {
  const logIn = useLogIn();
  const navigate = useNavigate();
  const from = useLocation()?.state?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");

  const tryLogIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const goBackPath = from ?? "/";

    if (email === "a@a.com" && password === "password") {
      logIn({ username: "aaa", type: "user" });
      navigate(goBackPath);
      return;
    }

    if (email === "b@b.com" && password === "password") {
      logIn({ username: "bbb", type: "admin" });
      navigate(goBackPath);
      return;
    }

    setMessage("Nieprawidłowe dane.");
  };

  return (
    <div className="text-center">
      <h1 className="fw-bold">Witaj!</h1>
      <Form className="login-box mt-5 p-5">
        <Form.Control
          type="email"
          placeholder="login@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Form.Control
          className="mt-2"
          type="password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          className="login-button mt-4"
          type="submit"
          variant="success"
          onClick={tryLogIn}>
          Zaloguj się
        </Button>
      </Form>
      <div className="msg-box mt-4 text-danger">{message}</div>
    </div>
  );
}

export { LoginBox };
