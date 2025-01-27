import { PropsWithChildren } from "react";
import type { Maybe } from "../../types";
import "./RoomBox.css";
import { makeClassString } from "../../utils";

interface RoomBoxProps extends PropsWithChildren {
  number: number;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Maybe<number>>>;
  isSelected: boolean;
}

function RoomBox({ number, setSelectedRoom, isSelected }: RoomBoxProps) {
  return (
    <div
      className={makeClassString(
        "room-box",
        "room-box-taken",
        isSelected && "room-box-selected"
      )}
      onClick={() => setSelectedRoom(number)}>
      <div className="fs-3">Sala</div>
      <div className="fs-1 fw-bold">{number}</div>
    </div>
  );
}

export { RoomBox };
