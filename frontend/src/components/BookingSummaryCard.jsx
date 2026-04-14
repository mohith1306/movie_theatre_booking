export default function BookingSummaryCard({ movie, theatre, seats }) {
  const total = seats.length * 150;

  return (
    <div className="w-full max-w-xl glass-panel rounded-xl overflow-hidden shadow-2xl border border-white/5 p-8 md:p-10">
      <h2 className="text-2xl font-extrabold tracking-tight mb-6">Booking Summary</h2>
      <div className="space-y-3 text-[#e5e2e1]">
        <p><span className="text-[#af8782]">Movie:</span> {movie?.title || "Not selected"}</p>
        <p><span className="text-[#af8782]">Theatre:</span> {theatre?.name || "Not selected"}</p>
        <p><span className="text-[#af8782]">Seats:</span> {seats.length > 0 ? seats.map((seat) => seat.seatNumber).join(", ") : "None"}</p>
      </div>
      <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
        <span className="uppercase tracking-widest text-xs text-[#af8782]">Total</span>
        <span className="text-4xl font-black text-[#ffb4aa]">Rs. {total}</span>
      </div>
    </div>
  );
}
