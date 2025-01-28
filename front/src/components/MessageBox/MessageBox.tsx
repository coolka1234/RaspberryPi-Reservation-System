import { PropsWithChildren, ReactNode } from "react";
import { Modal } from "react-bootstrap";
import { makeClassString } from "../../utils";

interface MessageBoxProps extends PropsWithChildren {
  icon: ReactNode;
  title: string;
  titleClass: string;
  message: string;
  buttons: ReactNode | ReactNode[];
  shown: boolean;
}

function MessageBox({
  icon,
  title,
  titleClass,
  message,
  buttons,
  shown,
}: MessageBoxProps) {
  return (
    <Modal
      id="message-box"
      backdrop="static"
      keyboard={false}
      centered
      show={shown}>
      <Modal.Header>
        <h1
          className={makeClassString(
            "d-flex",
            "align-items-center",
            "fs-3",
            titleClass
          )}>
          {icon}
          <span className="ms-2">{title}</span>
        </h1>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>{buttons}</Modal.Footer>
    </Modal>
  );
}

export { MessageBox };
