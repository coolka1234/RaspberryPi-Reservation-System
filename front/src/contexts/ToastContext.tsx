import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import type { Maybe } from "../models/common";

const TOAST_HIDE_DELAY_MILLIS = 3000;

type ShowToast = (message: string) => void;

interface ToastContextProps {
  showToast: ShowToast;
}

const ToastContext = createContext<Maybe<ToastContextProps>>(null);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [message, setMessage] = useState("");
  const [shown, setShown] = useState(false);

  const showToast: ShowToast = (message) => {
    setMessage(message);
    setShown(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer className="py-5" position="bottom-center">
        <Toast
          show={shown}
          onClose={() => setShown(false)}
          animation={true}
          delay={TOAST_HIDE_DELAY_MILLIS}
          autohide>
          <Toast.Body className="fs-5 text-center">{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useShowToast = (): ShowToast => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useShowToast must be used within a ToastProvider.");
  }

  return context.showToast;
};
