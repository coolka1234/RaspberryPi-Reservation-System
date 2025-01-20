import { Button, Form } from "react-bootstrap";
import "./LoginBox.css";
import { useState } from "react";

function LoginBox() {
  const [message, setMessage] = useState<string>("");

  const logIn = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setMessage("Nieprawidłowe dane.");
  };

  return (
    <div className="text-center">
      <h1 className="fw-bold">Witaj!</h1>
      <Form className="login-box mt-5 p-5">
        <Form.Control type="email" placeholder="login@example.com" />
        <Form.Control className="mt-2" type="password" placeholder="password" />
        <Button
          className="login-button mt-4"
          type="submit"
          variant="success"
          onClick={logIn}>
          Zaloguj się
        </Button>
      </Form>
      <div className="msg-box mt-4 text-danger">{message}</div>
    </div>
  );
}

export { LoginBox };
