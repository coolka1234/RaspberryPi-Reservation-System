import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { AddReservation } from "./pages/AddReservation/AddReservation";
import { AdminPanel } from "./pages/AdminPanel/AdminPanel";
import { EditRoom } from "./pages/EditRoom/EditRoom";
import { Login } from "./pages/Login/Login";
import { MainPage } from "./pages/MainPage/MainPage";
import { MyReservations } from "./pages/MyReservations/MyReservations";
import { ArchivedReservations } from "./pages/ArchivedReservations/ArchivedReservations";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-reservation/:roomNumber"
        element={
          <ProtectedRoute>
            <AddReservation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-reservations"
        element={
          <ProtectedRoute allowedRole="user">
            <MyReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/archived-reservations/:roomNumber"
        element={
          <ProtectedRoute allowedRole="admin">
            <ArchivedReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-room/:roomNumber?"
        element={
          <ProtectedRoute allowedRole="admin">
            <EditRoom />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
