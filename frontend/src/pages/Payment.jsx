import PaymentPage from "./PaymentPage";
import useBooking from "../hooks/useBooking";

export default function Payment() {
  const bookingFlow = useBooking();
  return <PaymentPage bookingFlow={bookingFlow} />;
}
