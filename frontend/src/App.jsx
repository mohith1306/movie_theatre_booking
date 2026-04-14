import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import useBooking from "./hooks/useBooking";
import Home from "./pages/Home";
import Theatre from "./pages/Theatre";
import Seats from "./pages/Seats";
import Summary from "./pages/Summary";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";

export default function App() {
  const RequirePaymentAccess = ({ children }) => {
    const bookingFlow = useBooking();
    if (!bookingFlow.user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const RequireConfirmationAccess = ({ children }) => {
    const bookingFlow = useBooking();
    if (!bookingFlow.bookingResult) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/theatre" element={<Theatre />} />
          <Route path="/seats" element={<Seats />} />
          <Route path="/summary" element={<Summary />} />
          <Route
            path="/payment"
            element={
              <RequirePaymentAccess>
                <Payment />
              </RequirePaymentAccess>
            }
          />
          <Route
            path="/confirmation"
            element={
              <RequireConfirmationAccess>
                <Confirmation />
              </RequireConfirmationAccess>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
