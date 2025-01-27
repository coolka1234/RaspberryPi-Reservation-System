import type { PropsWithChildren } from "react";
import type { Maybe } from "../../models/common";
import { makeClassString } from "../../utils";
import "./RoomBox.css";

interface RoomBoxProps extends PropsWithChildren {
  roomId: number;
  number: number;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Maybe<number>>>;
  isSelected: boolean;
}

function RoomBox({
  roomId,
  number,
  setSelectedRoom,
  isSelected,
}: RoomBoxProps) {
  return (
    <div
      className={makeClassString(
        "room-box",
        "room-box-taken",
        isSelected && "room-box-selected"
      )}
      onClick={() => setSelectedRoom(roomId)}>
      <div className="fs-3">Sala</div>
      <div className="fs-1 fw-bold">{number}</div>
    </div>
  );
}

export { RoomBox };
