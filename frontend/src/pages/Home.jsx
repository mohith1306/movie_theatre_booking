import HomePage from "./HomePage";
import useBooking from "../hooks/useBooking";

export default function Home() {
  const bookingFlow = useBooking();
  return <HomePage bookingFlow={bookingFlow} />;
}
