import { Logo } from "../components/Logo/Logo";
import { RoomDetails } from "../components/RoomDetails/RoomDetails";
import { Rooms } from "../components/Rooms/Rooms";
import { UserMenu } from "../components/UserMenu/UserMenu";
import "./MainPage.css";

function MainPage() {
  return (
    <>
      <header className="w-100 p-2 d-flex justify-content-between align-items-center">
        <Logo />
        <UserMenu />
      </header>
      <main className="main row h-100 p-4">
        <Rooms />
        <RoomDetails />
      </main>
    </>
  );
}

export { MainPage };
