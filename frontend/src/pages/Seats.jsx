import SeatSelectionPage from "./SeatSelectionPage";
import useBooking from "../hooks/useBooking";

export default function Seats() {
  const bookingFlow = useBooking();
  return <SeatSelectionPage bookingFlow={bookingFlow} />;
}
