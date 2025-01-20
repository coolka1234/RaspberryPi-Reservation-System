import { useState } from "react";
import { RoomBox } from "../RoomBox/RoomBox";

function Rooms() {
  const [rooms, setRooms] = useState([30, 31, 32]);

  return (
    <div className="submain col-8 p-4 d-flex flex-row gap-3">
      {rooms.map((roomNumber) => (
        <RoomBox number={roomNumber} />
      ))}
    </div>
  );
}

export { Rooms };
