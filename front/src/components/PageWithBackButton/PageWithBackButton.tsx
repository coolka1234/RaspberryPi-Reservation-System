import type { PropsWithChildren } from "react";
import { Button } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function PageWithBackButton({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  return (
    <>
      <Button
        className="btn btn-success position-absolute ms-4 mt-4"
        onClick={() => navigate("/")}>
        <ArrowLeft />
      </Button>
      <main className="h-100 p-4 d-flex justify-content-center align-items-center">
        <div className="d-flex flex-column justify-content-center align-items-center">
          {children}
        </div>
      </main>
    </>
  );
}

export { PageWithBackButton };
