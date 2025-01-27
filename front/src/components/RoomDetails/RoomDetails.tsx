import type { PropsWithChildren } from "react";
import type { Maybe } from "../../types";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/AuthContext";
import { Button } from "react-bootstrap";

interface RoomDetailsProps extends PropsWithChildren {
  selectedRoom: Maybe<number>;
}

function RoomDetails({ selectedRoom }: RoomDetailsProps) {
  const user = useUser()!;
  const navigate = useNavigate();

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
          <div className="d-flex flex-column justify-content-center gap-2">
            {user.type === "user" ? (
              <Button
                variant="success"
                onClick={() => navigate(`/add-reservation/${selectedRoom}`)}>
                Zarezerwuj
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  onClick={() => navigate(`/edit-room/${selectedRoom}`)}>
                  Edytuj
                </Button>
                <Button variant="success" onClick={() => {}}>
                  Usuń
                </Button>
                <Button
                  variant="success"
                  onClick={() => navigate("/archived-reservations")}>
                  Archiwum rezerwacji
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { RoomDetails };
