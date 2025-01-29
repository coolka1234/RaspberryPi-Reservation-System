import type { PropsWithChildren } from "react";
import type { Maybe } from "../../models/common";
import type { RoomStatus } from "../../models/Room";
import { makeClassString } from "../../utils";
import "./RoomBox.css";

interface RoomBoxProps extends PropsWithChildren {
  roomId: number;
  number: string;
  status: RoomStatus;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Maybe<number>>>;
  isSelected: boolean;
}

function RoomBox({
  roomId,
  number,
  status,
  setSelectedRoom,
  isSelected,
}: RoomBoxProps) {
  return (
    <div
      className={makeClassString(
        "room-box",
        `room-box-${status}`,
        isSelected && "room-box-selected"
      )}
      onClick={() => setSelectedRoom(roomId)}>
      <div className="fs-3">Sala</div>
      <div className="fs-1 fw-bold">{number}</div>
    </div>
  );
}

export { RoomBox };
