import type { PropsWithChildren } from "react";
import type { Maybe } from "../../types";

interface RoomDetailsProps extends PropsWithChildren {
  selectedRoom: Maybe<number>;
}

function RoomDetails({ selectedRoom }: RoomDetailsProps) {
  return (
    <div className="submain col-4 p-4">
      {selectedRoom != null && (
        <>
          <div className="text-center">
            <h2>Sala {selectedRoom} - szczegóły</h2>
          </div>
          <div>
            <h3>Przyszłe rezerwacje</h3>
            <ul>
              <li>sss</li>
              <li>aa</li>
              <li>bbb</li>
            </ul>
          </div>
          <div>
            <h3>Dane szczegółowe sali</h3>
            <ul>
              <li>
                <span className="fw-bold">Liczba miejsc: </span> 40
              </li>
              <li>
                <span className="fw-bold">Sprzęt: </span> rzutnik, drukarka,
                laptop
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export { RoomDetails };
