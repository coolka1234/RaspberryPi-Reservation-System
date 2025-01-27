import type { PropsWithChildren } from "react";
import type { Maybe } from "../../types";
import { useNavigate } from "react-router-dom";

interface RoomDetailsProps extends PropsWithChildren {
  selectedRoom: Maybe<number>;
}

function RoomDetails({ selectedRoom }: RoomDetailsProps) {
  const navigate = useNavigate();

  const navigateToAddReservation = (): void => {
    navigate(`/add-reservation/${selectedRoom}`);
  };

  return (
    <div className="submain col-4 p-4">
      {selectedRoom != null && (
        <div className="h-100 d-flex flex-column justify-content-between">
          <div>
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
          </div>
          <button
            className="btn btn-success"
            onClick={navigateToAddReservation}>
            Zarezerwuj
          </button>
        </div>
      )}
    </div>
  );
}

export { RoomDetails };
