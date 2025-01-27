import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Logo } from "../../components/Logo/Logo";
import { RoomDetails } from "../../components/RoomDetails/RoomDetails";
import { Rooms } from "../../components/Rooms/Rooms";
import { UserMenu } from "../../components/UserMenu/UserMenu";
import type { Maybe } from "../../models/common";
import type { Room } from "../../models/Room";
import "./MainPage.css";
import { queryFunctionFactory } from "../../api";
import { API_URLS, FETCH_KEYS } from "../../constants";

function MainPage() {
  const {
    isLoading,
    isError,
    data: rooms,
    refetch,
    isRefetching,
  } = useQuery<Room[]>({
    queryKey: [FETCH_KEYS.Rooms],
    queryFn: queryFunctionFactory(API_URLS.Rooms),
  });

  const [selectedRoomId, setSelectedRoomId] = useState<Maybe<number>>(null);
  const [selectedRoom, setSelectedRoom] = useState<Maybe<Room>>(null);

  useEffect(() => {
    setSelectedRoom(rooms?.find((room) => room.id === selectedRoomId));
  }, [selectedRoomId]);

  return (
    !isLoading && (
      <>
        <header className="header w-100 p-2 d-flex justify-content-between align-items-center">
          <Logo />
          <UserMenu />
        </header>
        <main className="main row p-4">
          <Rooms
            rooms={rooms!}
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
          />
          <RoomDetails selectedRoom={selectedRoom} refetchRooms={refetch} />
        </main>
      </>
    )
  );
}

export { MainPage };
