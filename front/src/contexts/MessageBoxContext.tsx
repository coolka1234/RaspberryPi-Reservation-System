import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { Button } from "react-bootstrap";
import {
  ExclamationOctagonFill,
  QuestionCircleFill,
} from "react-bootstrap-icons";
import { MessageBox } from "../components/MessageBox/MessageBox";
import type { Maybe, ObjectValues } from "../models/common";

export const MESSAGE_BOX_TYPES = {
  Confirm: "Confirm",
  Error: "Error",
} as const;
export type MessageBoxType = ObjectValues<typeof MESSAGE_BOX_TYPES>;

type ShowErrorMessageBox = (
  title?: string,
  message?: string,
  onClose?: Maybe<() => void>
) => void;
type ShowConfirmMessageBox = (
  title: string,
  message: string,
  onConfirm?: Maybe<() => void>
) => void;

interface MessageBoxContextProps {
  showErrorMessageBox: ShowErrorMessageBox;
  showConfirmMessageBox: ShowConfirmMessageBox;
}

const MessageBoxContext = createContext<Maybe<MessageBoxContextProps>>(null);

export const MessageBoxProvider = ({ children }: PropsWithChildren) => {
  const [icon, setIcon] = useState<ReactNode>(null);
  const [title, setTitle] = useState("");
  const [titleClass, setTitleClass] = useState("");
  const [message, setMessage] = useState("");
  const [buttons, setButtons] = useState<ReactNode>(null);
  const [shown, setShown] = useState(false);

  const showErrorMessageBox: ShowErrorMessageBox = (
    title = "Nieoczekiwany błąd!",
    message = "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.",
    onClose = null
  ) => {
    setTitle(title);
    setTitleClass("text-danger");
    setMessage(message);
    setIcon(<ExclamationOctagonFill />);
    setButtons(
      <Button
        variant="secondary"
        onClick={() => {
          setShown(false);
          onClose?.();
        }}>
        OK
      </Button>
    );
    setShown(true);
  };
  const showConfirmMessageBox: ShowConfirmMessageBox = (
    title,
    message,
    onConfirm = null
  ) => {
    setTitle(title);
    setTitleClass("");
    setMessage(message);
    setIcon(<QuestionCircleFill />);
    setButtons(
      <>
        <Button variant="secondary" onClick={() => setShown(false)}>
          Anuluj
        </Button>
        <Button
          variant="success"
          onClick={() => {
            setShown(false);
            onConfirm?.();
          }}>
          Potwierdź
        </Button>
      </>
    );
    setShown(true);
  };

  return (
    <MessageBoxContext.Provider
      value={{ showErrorMessageBox, showConfirmMessageBox }}>
      {children}
      <MessageBox
        icon={icon}
        title={title}
        titleClass={titleClass}
        message={message}
        buttons={buttons}
        shown={shown}
      />
    </MessageBoxContext.Provider>
  );
};

export const useShowErrorMessageBox = (): ShowErrorMessageBox => {
  const context = useContext(MessageBoxContext);

  if (!context) {
    throw new Error(
      "useShowErrorMessageBox must be used within a MessageBoxProvider."
    );
  }

  return context.showErrorMessageBox;
};
export const useShowConfirmMessageBox = (): ShowConfirmMessageBox => {
  const context = useContext(MessageBoxContext);

  if (!context) {
    throw new Error(
      "useShowConfirmMessageBox must be used within a MessageBoxProvider."
    );
  }

  return context.showConfirmMessageBox;
};
