import { useNavigate } from "react-router-dom";

export default function PaymentPage({ bookingFlow }) {
  const navigate = useNavigate();
  const total = bookingFlow.selectedSeats.length * 150;

  const handlePayNow = async () => {
    const customerId = bookingFlow.user?.userId;
    if (!customerId) {
      bookingFlow.setError("Please login before payment");
      navigate("/login");
      return;
    }

    const result = await bookingFlow.submitBooking(customerId, total);
    if (result) {
      navigate("/confirmation");
    }
  };

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 glass-panel rounded-xl p-6 border border-white/10">
        <h2 className="text-3xl font-black tracking-tighter mb-4">Secure Checkout</h2>
        <p className="text-[#af8782] mb-6">Complete your performance.</p>
        <p className="text-sm text-[#af8782]">Movie</p>
        <p className="font-bold mb-3">{bookingFlow.selectedMovie?.title || "Not selected"}</p>
        <p className="text-sm text-[#af8782]">Seats</p>
        <p className="font-bold mb-3">{bookingFlow.selectedSeats.map((s) => s.seatNumber).join(", ") || "None"}</p>
        <p className="text-sm text-[#af8782]">Total Amount</p>
        <p className="text-4xl font-black text-[#ffb4aa]">Rs. {total}</p>
      </div>

      <div className="lg:col-span-7 glass-panel rounded-xl p-8 border border-white/10">
        <h3 className="text-2xl font-bold mb-8">Payment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <input className="bg-transparent border-b border-white/20 py-2" placeholder="Cardholder Name" />
          <input className="bg-transparent border-b border-white/20 py-2" placeholder="Card Number" />
          <input className="bg-transparent border-b border-white/20 py-2" placeholder="MM / YY" />
          <input className="bg-transparent border-b border-white/20 py-2" placeholder="CVV" type="password" />
        </div>
        {bookingFlow.paymentStatus === "processing" && <p className="text-[#af8782] mb-3">Processing...</p>}
        {bookingFlow.error && <p className="error-text mb-3">{bookingFlow.error}</p>}
        <button
          type="button"
          className="w-full bg-gradient-to-r from-[#e50914] to-[#c0000c] text-white h-14 rounded-xl font-black"
          onClick={handlePayNow}
          disabled={bookingFlow.paymentStatus === "processing" || total === 0}
        >
          Pay Rs. {total} Securely
        </button>
      </div>
    </section>
  );
}
