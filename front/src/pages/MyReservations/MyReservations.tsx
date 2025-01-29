import { useEffect } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { fetchApi, queryFunctionFactory } from "../../api";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { API_URLS, FETCH_KEYS } from "../../constants";
import { useUser } from "../../contexts/AuthContext";
import {
  useShowConfirmMessageBox,
  useShowErrorMessageBox,
} from "../../contexts/MessageBoxContext";
import { useShowToast } from "../../contexts/ToastContext";
import type { UserReservation } from "../../models/Reservation";
import {
  formatDateFromReservation,
  formatHoursFromReservation,
} from "../../utils";

function MyReservations() {
  const user = useUser();

  const showConfirmMessageBox = useShowConfirmMessageBox();
  const showToast = useShowToast();

  const {
    isLoading,
    isError,
    data: reservations,
    refetch,
    isRefetching,
    isRefetchError,
  } = useQuery<UserReservation[]>({
    queryKey: [FETCH_KEYS.Reservations],
    queryFn: queryFunctionFactory(
      `${API_URLS.Reservations}?user_id=${user?.id}`
    ),
    enabled: user?.id != null,
  });

  const showErrorMessageBox = useShowErrorMessageBox();

  useEffect(() => {
    if (isError || isRefetchError) {
      showErrorMessageBox();
    }
  }, [isError, isRefetchError]);

  const cancelReservation = (reservationId: number): void => {
    showConfirmMessageBox(
      "Potwierdzenie",
      "Czy na pewno chcesz odwołać rezerwację?",
      async () => {
        try {
          await fetchApi(`${API_URLS.Reservations}/${reservationId}`, {
            method: "DELETE",
          });

          showToast("Rezerwacja odwołana pomyślnie.");

          refetch();
        } catch {
          showErrorMessageBox();
        }
      }
    );
  };

  return (
    <PageWithBackButton>
      {isLoading || isRefetching ? (
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
                  <tr key={reservation.id}>
                    <td>{idx + 1}</td>
                    <td>{formatDateFromReservation(reservation)}</td>
                    <td>{formatHoursFromReservation(reservation)}</td>
                    <td>{reservation.room_number}</td>
                    <td>
                      <Button
                        variant="success"
                        onClick={() => cancelReservation(reservation.id)}>
                        Odwołaj
                      </Button>
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
