import { useNavigate } from "react-router-dom";
import BookingSummaryCard from "../components/BookingSummaryCard";

export default function BookingSummaryPage({ bookingFlow }) {
  const navigate = useNavigate();

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center">
      <BookingSummaryCard
        movie={bookingFlow.selectedMovie}
        theatre={bookingFlow.selectedTheatre}
        seats={bookingFlow.selectedSeats}
      />
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold"
          onClick={() => navigate("/seats")}
        >
          Go Back
        </button>
        <button
          type="button"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#e50914] to-[#c0000c] text-white font-black"
          onClick={() => navigate("/payment")}
          disabled={bookingFlow.selectedSeats.length === 0}
        >
          Confirm Booking
        </button>
      </div>
    </section>
  );
}
