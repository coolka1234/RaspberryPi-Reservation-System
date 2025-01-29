import { useEffect } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { queryFunctionFactory } from "../../api";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { API_URLS, FETCH_KEYS } from "../../constants";
import { useUser } from "../../contexts/AuthContext";
import { useShowErrorMessageBox } from "../../contexts/MessageBoxContext";
import type { UserReservation } from "../../models/Reservation";
import {
  formatDateFromReservation,
  formatHoursFromReservation,
} from "../../utils";

function MyReservations() {
  const user = useUser();

  const {
    isLoading,
    isError,
    data: reservations,
  } = useQuery<UserReservation[]>({
    queryKey: [FETCH_KEYS.Reservations],
    queryFn: queryFunctionFactory(
      `${API_URLS.Reservations}?user_id=${user?.id}`
    ),
    enabled: user?.id != null,
  });

  const showErrorMessageBox = useShowErrorMessageBox();

  useEffect(() => {
    if (isError) {
      showErrorMessageBox();
    }
  }, [isError]);

  return (
    <PageWithBackButton>
      {isLoading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <>
          <h1>Moje rezerwacje</h1>
          {reservations?.length === 0 ? (
            <p className="mt-5">Nie masz obecnie żadnych rezerwacji.</p>
          ) : (
            <Table
              className="mt-5 text-center align-middle"
              striped
              bordered
              hover>
              <thead>
                <tr>
                  <th>Lp.</th>
                  <th>Data</th>
                  <th>Godziny</th>
                  <th>Sala</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {reservations?.map((reservation, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{formatDateFromReservation(reservation)}</td>
                    <td>{formatHoursFromReservation(reservation)}</td>
                    <td>{reservation.room_number}</td>
                    <td>
                      <Button variant="success">Odwołaj</Button>
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

export { MyReservations };
