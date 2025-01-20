import { Button, Form } from "react-bootstrap";
import "./LoginBox.css";
import { useState } from "react";
import type { Maybe } from "../types";

function LoginBox() {
  const [message, setMessage] = useState<Maybe<string>>(null);

  return (
    <div className="text-center">
      <h1 className="fw-bold">Witaj!</h1>
      <Form className="login-box mt-5 p-5">
        <Form.Control type="email" placeholder="login@example.com" />
        <Form.Control className="mt-2" type="password" />
        <Button className="login-button mt-4" type="submit" variant="success">
          Zaloguj się
        </Button>
      </Form>
    </div>
  );
}

export { LoginBox };
