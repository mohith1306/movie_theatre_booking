import { Link } from "react-router-dom";
import { useState } from "react";
import { cancelBooking } from "../services/api";

export default function ConfirmationPage({ bookingFlow }) {
  const result = bookingFlow.bookingResult;
  const [cancelMessage, setCancelMessage] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!result?.bookingId) {
      return;
    }

    setIsCancelling(true);
    setCancelMessage("");

    try {
      const response = await cancelBooking(result.bookingId);
      bookingFlow.setBookingResult({
        ...result,
        status: "CANCELLED",
        message: response.message || "Booking cancelled successfully"
      });
      setCancelMessage(response.message || "Booking cancelled successfully");
    } catch {
      setCancelMessage("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#353534] mb-6">
        <span className="material-symbols-outlined text-6xl text-green-500">check_circle</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">Booking Confirmed!</h1>
      <p className="text-[#af8782] mb-8 uppercase tracking-widest">Enjoy the cinematic experience</p>

      <div className="w-full max-w-2xl glass-panel rounded-xl p-8 border border-white/10 text-left">
        <p className="text-sm text-[#af8782]">Status</p>
        <p className="text-xl font-bold mb-4">{result?.status || "N/A"}</p>
        <p className="text-sm text-[#af8782]">Booking ID</p>
        <p className="text-xl font-bold mb-4">{result?.bookingId || "N/A"}</p>
        <p className="text-sm text-[#af8782]">Message</p>
        <p className="text-lg font-medium">{result?.message || "No booking response available"}</p>
        {cancelMessage && <p className="text-sm mt-4 text-[#ffb4ab]">{cancelMessage}</p>}
      </div>

      <div className="mt-8 flex gap-3 flex-wrap justify-center">
        {result?.bookingId && result.status !== "CANCELLED" && (
          <button
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold disabled:opacity-60"
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
        <Link className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold" to="/">
          Go to Home
        </Link>
      </div>
    </section>
  );
}
