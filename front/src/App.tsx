import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import "./common.css";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { MessageBoxProvider } from "./contexts/MessageBoxContext";
import { RefetchProvider } from "./contexts/RefetchContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AddReservation } from "./pages/AddReservation/AddReservation";
import { AddRoom } from "./pages/AddRoom/AddRoom";
import { AdminPanel } from "./pages/AdminPanel/AdminPanel";
import { ArchivedReservations } from "./pages/ArchivedReservations/ArchivedReservations";
import { EditRoom } from "./pages/EditRoom/EditRoom";
import { Login } from "./pages/Login/Login";
import { MainPage } from "./pages/MainPage/MainPage";
import { MyReservations } from "./pages/MyReservations/MyReservations";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RefetchProvider>
        <MessageBoxProvider>
          <ToastProvider>
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
                path="/add-reservation/:roomId"
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
                path="/archived-reservations/:roomId"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <ArchivedReservations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-room"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AddRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-room/:roomId"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <EditRoom />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ToastProvider>
        </MessageBoxProvider>
      </RefetchProvider>
    </QueryClientProvider>
  );
}

export default App;
