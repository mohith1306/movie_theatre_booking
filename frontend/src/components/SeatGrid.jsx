import Seat from "./Seat";
import { createSeatMatrix } from "../utils/helpers";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SeatGrid({ seats, selectedSeatIds, onToggleSeat, onInvalidAction }) {
  const seatMatrix = createSeatMatrix(seats);

  const getSeat = (rowLetter, colNumber) => seatMatrix[rowLetter]?.[colNumber] || null;

  return (
    <div className="seat-grid-container w-full overflow-x-auto pb-8">
      <div className="mb-8 flex flex-col items-center">
        <div className="screen-curve mb-3" />
        <p className="text-[#af8782] text-[10px] uppercase tracking-[0.3em] font-medium">Screen</p>
      </div>

      <div className="seat-grid min-w-[700px] flex flex-col gap-3">
        {ROWS.map((rowLetter) => (
          <div key={rowLetter} className="flex items-center justify-center gap-2">
            <span className="w-6 text-[10px] font-bold text-[#af8782]/60">{rowLetter}</span>
            <div className="flex gap-2">
              {COLUMNS.map((colNumber) => {
                const seat = getSeat(rowLetter, colNumber);

                if (!seat) {
                  return (
                    <div
                      key={`empty-${rowLetter}${colNumber}`}
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-t-lg border border-white/5 bg-transparent"
                      title={`${rowLetter}${colNumber} - Not configured`}
                    />
                  );
                }

                const handleClick = () => {
                  if (seat.status === "BOOKED" || seat.status === "LOCKED") {
                    onInvalidAction?.(
                      seat.status === "BOOKED"
                        ? `Seat ${seat.seatNumber} is already booked`
                        : `Seat ${seat.seatNumber} is currently locked`
                    );
                    return;
                  }

                  onToggleSeat(seat);
                };

                return (
                  <Seat
                    key={seat.seatId}
                    seat={seat}
                    isSelected={selectedSeatIds.includes(seat.seatId)}
                    onClick={handleClick}
                    isDisabled={seat.status === "BOOKED"}
                  />
                );
              })}
            </div>
            <span className="w-6 text-[10px] font-bold text-[#af8782]/60">{rowLetter}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
