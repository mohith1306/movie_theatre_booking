import ConfirmationPage from "./ConfirmationPage";
import useBooking from "../hooks/useBooking";

export default function Confirmation() {
  const bookingFlow = useBooking();
  return <ConfirmationPage bookingFlow={bookingFlow} />;
}
