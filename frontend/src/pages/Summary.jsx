import BookingSummaryPage from "./BookingSummaryPage";
import useBooking from "../hooks/useBooking";

export default function Summary() {
  const bookingFlow = useBooking();
  return <BookingSummaryPage bookingFlow={bookingFlow} />;
}
