export const isBlockedSeat = (seatStatus) => {
  return seatStatus === "BOOKED" || seatStatus === "LOCKED";
};

export const mapBackendStatusToUi = (seatStatus) => {
  switch (seatStatus) {
    case "BOOKED":
      return "booked";
    case "LOCKED":
      return "locked";
    case "UNDER_MAINTENANCE":
      return "locked";
    case "AVAILABLE":
    case "CANCELLED":
    default:
      return "available";
  }
};
