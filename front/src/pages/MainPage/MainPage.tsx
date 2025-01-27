import { useState } from "react";
import { Logo } from "../../components/Logo/Logo";
import { RoomDetails } from "../../components/RoomDetails/RoomDetails";
import { Rooms } from "../../components/Rooms/Rooms";
import { UserMenu } from "../../components/UserMenu/UserMenu";
import type { Maybe } from "../../types";
import "./MainPage.css";

function MainPage() {
  const [rooms, setRooms] = useState([{ number: 30 }, { number: 31 }]);
  const [selectedRoom, setSelectedRoom] = useState<Maybe<number>>(null);

  return (
    <>
      <header className="w-100 p-2 d-flex justify-content-between align-items-center">
        <Logo />
        <UserMenu />
      </header>
      <main className="main row h-100 p-4">
        <Rooms
          rooms={rooms}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
        />
        <RoomDetails selectedRoom={selectedRoom} />
      </main>
    </>
  );
}

export { MainPage };
