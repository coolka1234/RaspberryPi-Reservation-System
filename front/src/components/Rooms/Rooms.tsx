import type { PropsWithChildren } from "react";
import { Room } from "../../models/Room";
import type { Maybe } from "../../types";
import { RoomBox } from "../RoomBox/RoomBox";

interface RoomProps extends PropsWithChildren {
  rooms: Room[];
  selectedRoom: Maybe<number>;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Maybe<number>>>;
}

function Rooms({ rooms, selectedRoom, setSelectedRoom }: RoomProps) {
  return (
    <div className="col-8 h-100">
      <div className="submain h-100 p-4 d-flex flex-row gap-3">
        {rooms.map((room) => (
          <RoomBox
            key={room.number}
            number={room.number}
            setSelectedRoom={setSelectedRoom}
            isSelected={room.number === selectedRoom}
          />
        ))}
      </div>
    </div>
  );
}

export { Rooms };
