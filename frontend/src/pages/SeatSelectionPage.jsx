import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Legend from "../components/Legend";
import Loader from "../components/Loader";
import SeatGrid from "../components/SeatGrid";
import SummaryBar from "../components/SummaryBar";

export default function SeatSelectionPage({ bookingFlow }) {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <div className="text-center mb-8">
          <div className="h-1 w-2/3 mx-auto bg-gradient-to-r from-transparent via-[#ffb4aa] to-transparent rounded-full mb-3" />
          <p className="text-[#af8782] text-xs uppercase tracking-[0.3em]">Digital Projection Screen</p>
        </div>

        <Alert message={bookingFlow.error} />
        {bookingFlow.isLoadingSeats ? <Loader label="Loading seats..." /> : null}

        <SeatGrid
          seats={bookingFlow.seatData}
          selectedSeatIds={bookingFlow.selectedSeatIds}
          onToggleSeat={bookingFlow.toggleSeatSelection}
          onInvalidAction={bookingFlow.setError}
        />

        <Legend />
      </div>

      <aside className="lg:col-span-4">
        <div className="glass-panel rounded-2xl p-6 border border-white/10 sticky top-28">
          <h2 className="text-2xl font-black mb-5">Order Summary</h2>
          <p className="text-sm text-[#af8782]">Movie</p>
          <p className="font-bold mb-4">{bookingFlow.selectedMovie?.title || "Not selected"}</p>
          <p className="text-sm text-[#af8782]">Theatre</p>
          <p className="font-bold mb-4">{bookingFlow.selectedTheatre?.name || "Not selected"}</p>
          <p className="text-sm text-[#af8782]">Seats</p>
          <p className="font-bold mb-6">{bookingFlow.selectedSeats.map((seat) => seat.seatNumber).join(", ") || "None"}</p>

          <SummaryBar selectedSeats={bookingFlow.selectedSeats} />

          <button
            type="button"
            className="w-full bg-[#e50914] text-white py-4 rounded-xl font-black tracking-tight hover:opacity-90"
            onClick={() => navigate("/summary")}
            disabled={bookingFlow.selectedSeatIds.length === 0}
          >
            Proceed to Booking
          </button>
        </div>
      </aside>
    </section>
  );
}
