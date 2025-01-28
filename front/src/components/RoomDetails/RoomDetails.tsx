import type { PropsWithChildren } from "react";
import { Button } from "react-bootstrap";
import type { UseQueryResult } from "react-query";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "../../api";
import { API_URLS } from "../../constants";
import { useUser } from "../../contexts/AuthContext";
import {
  useShowConfirmMessageBox,
  useShowErrorMessageBox,
} from "../../contexts/MessageBoxContext";
import { useShowToast } from "../../contexts/ToastContext";
import type { Maybe } from "../../models/common";
import type { Room } from "../../models/Room";

interface RoomDetailsProps extends PropsWithChildren {
  selectedRoom: Maybe<Room>;
  refetchRooms: () => Promise<UseQueryResult>;
}

function RoomDetails({ selectedRoom, refetchRooms }: RoomDetailsProps) {
  const user = useUser()!;
  const navigate = useNavigate();
  const showConfirmMessageBox = useShowConfirmMessageBox();
  const showErrorMessageBox = useShowErrorMessageBox();
  const showToast = useShowToast();

  const deleteRoom = (): void => {
    if (selectedRoom == null) {
      return;
    }

    showConfirmMessageBox(
      "Potwierdzenie",
      `Czy na pewno chcesz usunąć salę ${selectedRoom.number}?`,
      async () => {
        try {
          await fetchApi(`${API_URLS.Rooms}/${selectedRoom.id}`, {
            method: "DELETE",
          });

          showToast("Sala usunięta pomyślnie.");

          refetchRooms();
        } catch {
          showErrorMessageBox(
            "Nieoczekiwany błąd!",
            "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później."
          );
        }
      }
    );
  };

  return (
    <div className="submain col-4 p-4">
      {selectedRoom != null && (
        <div className="h-100 d-flex flex-column justify-content-between">
          <div>
            <div className="text-center">
              <h2>Sala {selectedRoom.number} - szczegóły</h2>
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
                  <span className="fw-bold">Liczba miejsc: </span>{" "}
                  {selectedRoom.capacity}
                </li>
                <li>
                  <span className="fw-bold">Sprzęt: </span>{" "}
                  {selectedRoom.equipment}
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center gap-2">
            {user.type === "user" ? (
              <Button
                variant="success"
                onClick={() => navigate(`/add-reservation/${selectedRoom.id}`)}>
                Zarezerwuj
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  onClick={() => navigate(`/edit-room/${selectedRoom.id}`)}>
                  Edytuj
                </Button>
                <Button variant="success" onClick={deleteRoom}>
                  Usuń
                </Button>
                <Button
                  variant="success"
                  onClick={() =>
                    navigate(`/archived-reservations/${selectedRoom.id}`)
                  }>
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
