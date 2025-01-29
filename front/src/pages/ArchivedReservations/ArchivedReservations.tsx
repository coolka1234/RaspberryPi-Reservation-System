import { useEffect } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { queryFunctionFactory } from "../../api";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { API_URLS, FETCH_KEYS } from "../../constants";
import { useShowErrorMessageBox } from "../../contexts/MessageBoxContext";
import type { Reservation } from "../../models/Reservation";
import type { Room } from "../../models/Room";

function ArchivedReservations() {
  const { roomId } = useParams();

  const {
    isLoading: isRoomLoading,
    isError: isRoomError,
    data: room,
  } = useQuery<Room>({
    queryKey: [FETCH_KEYS.ArchivedReservationsRoom],
    queryFn: queryFunctionFactory(`${API_URLS.Rooms}/${roomId}`),
    enabled: roomId != null,
  });

  const {
    isLoading: isReservationsLoading,
    isError: isReservationsError,
    data: archivedReservations,
  } = useQuery<Reservation[]>({
    queryKey: [FETCH_KEYS.ArchivedReservations],
    queryFn: queryFunctionFactory(`${API_URLS.Reservations}?room_id=${roomId}`),
    enabled: roomId != null,
  });

  const showErrorMessageBox = useShowErrorMessageBox();

  useEffect(() => {
    if (isRoomError || isReservationsError) {
      showErrorMessageBox();
    }
  }, [isRoomError, isReservationsError]);

  const formatDate = (reservation: Reservation): string => {
    const [date] = reservation.start_date.split(" ");

    return date;
  };

  const formatHours = (reservation: Reservation): string => {
    const [, startHour] = reservation.start_date.split(" ");
    const [, endHour] = reservation.end_date.split(" ");

    return `${startHour} - ${endHour}`;
  };

  return (
    <PageWithBackButton>
      {isRoomLoading || isReservationsLoading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <>
          <h1>Archiwalne rezerwacje dla sali {room?.number}</h1>
          {archivedReservations?.length === 0 ? (
            <p className="mt-5">Nie ma żadnych rezerwacji dla tej sali.</p>
          ) : (
            <Table
              className="mt-5 text-center align-middle"
              striped
              bordered
              hover>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Godziny</th>
                  <th>Użytkownik</th>
                </tr>
              </thead>
              <tbody>
                {archivedReservations?.map((reservation, idx) => (
                  <tr key={idx}>
                    <td>{formatDate(reservation)}</td>
                    <td>{formatHours(reservation)}</td>
                    <td>
                      {reservation.name} {reservation.surname}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </PageWithBackButton>
  );
}

export { ArchivedReservations };
