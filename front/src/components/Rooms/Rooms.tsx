import type { PropsWithChildren } from "react";
import { Room } from "../../models/Room";
import type { Maybe } from "../../models/common";
import { RoomBox } from "../RoomBox/RoomBox";

interface RoomProps extends PropsWithChildren {
  rooms: Room[];
  selectedRoomId: Maybe<number>;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<Maybe<number>>>;
}

function Rooms({ rooms, selectedRoomId, setSelectedRoomId }: RoomProps) {
  return (
    <div className="col-8 h-100">
      <div className="submain h-100 p-4 d-flex flex-wrap flex-row align-content-start gap-3">
        {rooms.map((room) => (
          <RoomBox
            key={room.id}
            roomId={room.id}
            number={room.number}
            setSelectedRoom={setSelectedRoomId}
            isSelected={room.id === selectedRoomId}
          />
        ))}
      </div>
    </div>
  );
}

export { Rooms };
