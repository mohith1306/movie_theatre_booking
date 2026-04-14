export const STORAGE_KEYS = {
  user: "movie_theatre_user",
  booking: "movie_theatre_booking_state"
};

export const MOVIES = [
  {
    id: 1,
    title: "Shadow Protocol",
    genre: "Sci-Fi / Thriller",
    duration: "2h 45m",
    rating: "8.9",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1AfJOzWrL4b45qiXiULu4xMQYzneANsqKB2ojzgaujsvDtl5dA3RwDHx6uE5IK_9JOmolyVXM9_J0dZgGlzqYKsEkM0ulgX6rBNiZ_ORhDVVELzexWURcXVlwrBOcmMp2n2sVBA5qygsQTDvAt85AKYIoeZz0FFFZZ7uqUILklj4icMKCi2q9DzWrnHL9HbssVIBlKCCczdpkBPX_iRwPb7crCP3iMVtn-rHHAa8mafsTlQuok5Ax-EQq8VQmPBOhEvzG9SFJ2hQ"
  },
  {
    id: 2,
    title: "The Last Case",
    genre: "Crime / Drama",
    duration: "1h 55m",
    rating: "9.2",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmkf5UJQ1FP4USVhrZydWphsHzdUeiNPveaR0BbhePSpApIrxH8iTO_y5U6hDIRhs_JG5oAM-sAxUdeXYuf0wviL8lRhwRAInyJmfxsbxTHBxdUD5fFwdUbKw5nt_-YmFqbYs15uaw2OuAux5fVcPOW69pYDbY0JhbcQ91NBKNm_Q9wKIzzzv8QFGWqAB6jIQidabZOhyGTjZ_soLxcd1JVk5Lo7DagNLqrdsR3fNKIlntXNtfigO78pnIRlWuevhtIf8uSomCKpg"
  }
];

export const THEATRES = [
  {
    theatreId: 1,
    name: "Grand Noir Cineplex",
    location: "Level 4, Orion Mall",
    showTimes: [
      { id: 1, label: "10:45 AM" },
      { id: 2, label: "02:30 PM" },
      { id: 3, label: "06:15 PM" }
    ]
  },
  {
    theatreId: 2,
    name: "The Gallery Cinema",
    location: "7th Ave, Royal Square",
    showTimes: [
      { id: 4, label: "01:00 PM" },
      { id: 5, label: "04:30 PM" },
      { id: 6, label: "08:00 PM" }
    ]
  }
];

export function safeParseJSON(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }
  return safeParseJSON(window.localStorage.getItem(STORAGE_KEYS.user), null);
}

export function seatUiStatus(status, selectedSeatIds, seatId) {
  if (selectedSeatIds.includes(seatId)) {
    return "selected";
  }

  switch (status) {
    case "BOOKED":
      return "booked";
    case "LOCKED":
      return "locked";
    default:
      return "available";
  }
}

export function isSeatSelectable(status) {
  return status !== "BOOKED" && status !== "LOCKED" && status !== "UNDER_MAINTENANCE";
}

export function getBookingTotal(selectedSeats) {
  return selectedSeats.length * 150;
}

export function normalizeMovie(movie) {
  return {
    ...movie,
    id: movie.id ?? movie.movieId,
    movieId: movie.movieId ?? movie.id,
    title: movie.title ?? movie.movieName,
    thumbnailUrl: movie.thumbnailUrl ?? movie.image ?? ""
  };
}

export function normalizeShow(show) {
  return {
    ...show,
    id: show.id ?? show.showId,
    showId: show.showId ?? show.id,
    screenName: show.screenName ?? "Screen",
    formattedShowTime: formatShowTime(show.showTime)
  };
}

export function normalizeTheatre(theatre) {
  return {
    ...theatre,
    id: theatre.id ?? theatre.theatreId,
    theatreId: theatre.theatreId ?? theatre.id,
    shows: Array.isArray(theatre.shows) ? theatre.shows.map(normalizeShow) : []
  };
}

export function formatShowTime(showTime) {
  if (!showTime) {
    return "";
  }

  const date = new Date(showTime);
  if (Number.isNaN(date.getTime())) {
    return String(showTime);
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function normalizeSeat(seat) {
  const seatNumber = seat.seatNumber || `${seat.rowLetter}${seat.colNumber}`;
  const match = seatNumber.match(/^([A-Z])(\d{1,2})$/i);
  const rowLetter = seat.rowLetter || (match ? match[1].toUpperCase() : "A");
  const colNumber = seat.colNumber || (match ? Number(match[2]) : 1);

  return {
    ...seat,
    id: seat.id ?? seat.seatId,
    seatId: seat.seatId ?? seat.id,
    seatNumber,
    rowLetter,
    colNumber,
    status: String(seat.status || "AVAILABLE").toUpperCase()
  };
}

export function createSeatMatrix(seats) {
  const matrix = {};

  for (const seat of seats) {
    if (!matrix[seat.rowLetter]) {
      matrix[seat.rowLetter] = {};
    }
    matrix[seat.rowLetter][seat.colNumber] = seat;
  }

  return matrix;
}

export function getSeatStatusLabel(status) {
  switch (status) {
    case "BOOKED":
      return "Booked";
    case "LOCKED":
      return "Locked";
    case "AVAILABLE":
      return "Available";
    default:
      return "Available";
  }
}
