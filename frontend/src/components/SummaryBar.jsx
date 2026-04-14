import { getBookingTotal } from "../utils/helpers";

export default function SummaryBar({ selectedSeats }) {
  const total = getBookingTotal(selectedSeats);

  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#201f1f] border border-white/10 px-4 py-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#af8782]">Selected Seats</p>
        <p className="font-bold">{selectedSeats.length > 0 ? selectedSeats.map((seat) => seat.seatNumber).join(", ") : "None"}</p>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase tracking-widest text-[#af8782]">Total</p>
        <p className="text-2xl font-black text-[#ffb4aa]">Rs. {total}</p>
      </div>
    </div>
  );
}
