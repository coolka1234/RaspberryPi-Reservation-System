import { useState } from "react";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { Table } from "react-bootstrap";

function MyReservations() {
  const [reservations, setReservations] = useState([
    {
      date: "10.01.2025 10:00-14:00",
      roomNumber: 30,
    },
    {
      date: "11.01.2025 10:00-12:00",
      roomNumber: 33,
    },
  ]);

  return (
    <PageWithBackButton>
      <h1>Moje rezerwacje</h1>
      {reservations.length === 0 ? (
        <p className="mt-5">Nie masz obecnie żadnych rezerwacji.</p>
      ) : (
        <Table className="mt-5 text-center align-middle" striped bordered hover>
          <thead>
            <tr>
              <th>Lp.</th>
              <th>Data</th>
              <th>Sala</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{reservation.date}</td>
                <td>{reservation.roomNumber}</td>
                <td>
                  <button className="btn btn-success">Odwołaj</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageWithBackButton>
  );
}

export { MyReservations };
