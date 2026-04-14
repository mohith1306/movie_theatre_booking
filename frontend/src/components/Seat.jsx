function getSeatClasses(seat, isSelected) {
  const statusClasses = {
    AVAILABLE: "bg-green-500/70 hover:bg-green-500 text-white",
    SELECTED: "bg-blue-500 text-white scale-105 ring-2 ring-blue-300",
    BOOKED: "bg-red-500/80 text-white opacity-70 cursor-not-allowed",
    LOCKED: "bg-yellow-400 text-black opacity-90 cursor-not-allowed"
  };

  const normalizedStatus = seat.status === "BOOKED" || seat.status === "LOCKED"
    ? seat.status
    : isSelected
      ? "SELECTED"
      : "AVAILABLE";

  return statusClasses[normalizedStatus] || statusClasses.AVAILABLE;
}

export default function Seat({ seat, isSelected, onClick, isDisabled }) {
  const disabled = isDisabled || seat.status === "BOOKED" || seat.status === "LOCKED";

  return (
    <button
      type="button"
      title={`${seat.seatNumber} - ${seat.status}`}
      className={`relative group w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-t-lg text-[10px] font-black transition-all duration-200 ease-out hover:scale-110 ${getSeatClasses(seat, isSelected)}`}
      onClick={() => onClick(seat)}
      aria-disabled={disabled}
    >
      {seat.seatNumber}
      <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {seat.seatNumber} · {seat.status}
      </span>
    </button>
  );
}
