import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { AddReservation } from "./pages/AddReservation/AddReservation";
import { AdminPanel } from "./pages/AdminPanel/AdminPanel";
import { EditRoom } from "./pages/EditRoom/EditRoom";
import { Login } from "./pages/Login/Login";
import { MainPage } from "./pages/MainPage/MainPage";
import { MyReservations } from "./pages/MyReservations/MyReservations";

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
          <ProtectedRoute>
            <MyReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-room/:roomNumber?"
        element={
          <ProtectedRoute>
            <EditRoom />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
