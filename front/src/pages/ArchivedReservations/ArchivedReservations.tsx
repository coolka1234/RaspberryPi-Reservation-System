import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageWithBackButton } from "../../components/PageWithBackButton/PageWithBackButton";
import { Table } from "react-bootstrap";

function ArchivedReservations() {
  const { roomNumber } = useParams();
  const navigate = useNavigate();

  const [archivedReservations, setArchivedReservations] = useState([
    {
      date: "10.01.2025 10:00-14:00",
      user: "aaa",
    },
    {
      date: "11.01.2025 10:00-12:00",
      user: "bbb",
    },
  ]);

  if (roomNumber == null) {
    navigate("/");
  }

  return (
    <PageWithBackButton>
      <h1>Archiwalne rezerwacje dla sali {roomNumber}</h1>
      {archivedReservations.length === 0 ? (
        <p className="mt-5">Nie masz obecnie żadnych rezerwacji.</p>
      ) : (
        <Table className="mt-5 text-center align-middle" striped bordered hover>
          <thead>
            <tr>
              <th>Data</th>
              <th>Użytkownik</th>
            </tr>
          </thead>
          <tbody>
            {archivedReservations.map((reservation, idx) => (
              <tr key={idx}>
                <td>{reservation.date}</td>
                <td>{reservation.user}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageWithBackButton>
  );
}

export { ArchivedReservations };
