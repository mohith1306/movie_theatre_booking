import TheatreSelectionPage from "./TheatreSelectionPage";
import useBooking from "../hooks/useBooking";

export default function Theatre() {
  const bookingFlow = useBooking();
  return <TheatreSelectionPage bookingFlow={bookingFlow} />;
}
