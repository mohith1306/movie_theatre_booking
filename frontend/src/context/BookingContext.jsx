import { createContext, useEffect, useMemo, useState } from "react";
import { createBooking, fetchSeats, getMovies, getTheatres, loginUser } from "../services/api";
import { getStoredUser, isSeatSelectable, normalizeMovie, normalizeSeat, normalizeTheatre, safeParseJSON, seatUiStatus, STORAGE_KEYS } from "../utils/helpers";

const BookingContext = createContext(null);

const initialBookingState = {
  movies: [],
  theatres: [],
  isLoadingCatalog: false,
  catalogError: "",
  selectedMovie: null,
  selectedTheatre: null,
  selectedShowId: null,
  seatData: [],
  selectedSeatIds: [],
  bookingResult: null,
  paymentStatus: "idle",
  isLoadingSeats: false,
  error: ""
};

export function BookingProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return initialBookingState;
    }

    const storedBooking = safeParseJSON(window.localStorage.getItem(STORAGE_KEYS.booking), null);
    return storedBooking ? { ...initialBookingState, ...storedBooking } : initialBookingState;
  });

  useEffect(() => {
    const loadCatalog = async () => {
      setState((previous) => ({ ...previous, isLoadingCatalog: true, catalogError: "" }));

      try {
        const [movies, theatres] = await Promise.all([getMovies(), getTheatres()]);

        setState((previous) => ({
          ...previous,
          movies: movies.map(normalizeMovie),
          theatres: theatres.map(normalizeTheatre),
          isLoadingCatalog: false
        }));
      } catch {
        setState((previous) => ({
          ...previous,
          isLoadingCatalog: false,
          catalogError: "Failed to load movies or theatres"
        }));
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (user) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.booking, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const loadSeats = async () => {
      if (!state.selectedShowId) {
        return;
      }

      setState((previous) => ({ ...previous, isLoadingSeats: true, error: "" }));

      try {
        const seats = await fetchSeats(state.selectedShowId);
        setState((previous) => ({
          ...previous,
          seatData: seats.map((seat) => {
            const normalizedSeat = normalizeSeat(seat);

            return {
              ...normalizedSeat,
              uiStatus: seatUiStatus(normalizedSeat.status, previous.selectedSeatIds, normalizedSeat.seatId)
            };
          }),
          isLoadingSeats: false
        }));
      } catch {
        setState((previous) => ({
          ...previous,
          isLoadingSeats: false,
          error: "Failed to load seats"
        }));
      }
    };

    loadSeats();
  }, [state.selectedShowId]);

  useEffect(() => {
    setState((previous) => ({
      ...previous,
      seatData: previous.seatData.map((seat) => ({
        ...seat,
        uiStatus: seatUiStatus(seat.status, previous.selectedSeatIds, seat.seatId)
      }))
    }));
  }, [state.selectedSeatIds]);

  const selectedSeats = useMemo(() => {
    return state.seatData.filter((seat) => state.selectedSeatIds.includes(seat.seatId));
  }, [state.seatData, state.selectedSeatIds]);

  const setSelectedMovie = (selectedMovie) => {
    setState((previous) => ({ ...previous, selectedMovie }));
  };

  const setSelectedTheatre = (selectedTheatre) => {
    setState((previous) => ({ ...previous, selectedTheatre }));
  };

  const setSelectedShowId = (selectedShowId) => {
    setState((previous) => ({
      ...previous,
      selectedShowId,
      selectedSeatIds: [],
      bookingResult: null,
      paymentStatus: "idle"
    }));
  };

  const toggleSeatSelection = (seat) => {
    if (!isSeatSelectable(seat.status)) {
      return;
    }

    setState((previous) => {
      const nextSelectedSeatIds = previous.selectedSeatIds.includes(seat.seatId)
        ? previous.selectedSeatIds.filter((seatId) => seatId !== seat.seatId)
        : [...previous.selectedSeatIds, seat.seatId];

      return {
        ...previous,
        selectedSeatIds: nextSelectedSeatIds,
        seatData: previous.seatData.map((currentSeat) => ({
          ...currentSeat,
          uiStatus: seatUiStatus(currentSeat.status, nextSelectedSeatIds, currentSeat.seatId)
        }))
      };
    });
  };

  const submitBooking = async (customerId, paymentAmount) => {
    if (!state.selectedShowId || state.selectedSeatIds.length === 0) {
      setState((previous) => ({ ...previous, error: "Please select at least one seat" }));
      return null;
    }

    setState((previous) => ({ ...previous, paymentStatus: "processing", error: "" }));

    try {
      const payload = {
        customerId,
        showId: state.selectedShowId,
        seatCount: state.selectedSeatIds.length,
        preferredSeatIds: state.selectedSeatIds,
        paymentAmount
      };

      const result = await createBooking(payload);
      const normalizedResult = {
        ...result,
        bookingId: result.bookingId ?? result.id
      };
      setState((previous) => ({
        ...previous,
        bookingResult: normalizedResult,
        paymentStatus: normalizedResult.status === "CONFIRMED" ? "success" : "failed"
      }));
      return normalizedResult;
    } catch {
      setState((previous) => ({
        ...previous,
        paymentStatus: "failed",
        error: "Booking request failed"
      }));
      return null;
    }
  };

  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    setUser(response);
    return response;
  };

  const logout = () => {
    setUser(null);
  };

  const clearBooking = () => {
    setState(initialBookingState);
  };

  const value = {
    user,
    login,
    logout,
    movies: state.movies,
    theatres: state.theatres,
    isLoadingCatalog: state.isLoadingCatalog,
    catalogError: state.catalogError,
    selectedMovie: state.selectedMovie,
    setSelectedMovie,
    selectedTheatre: state.selectedTheatre,
    setSelectedTheatre,
    selectedShowId: state.selectedShowId,
    setSelectedShowId,
    seatData: state.seatData,
    selectedSeats,
    selectedSeatIds: state.selectedSeatIds,
    toggleSeatSelection,
    bookingResult: state.bookingResult,
    paymentStatus: state.paymentStatus,
    isLoadingSeats: state.isLoadingSeats,
    error: state.error,
    setError: (error) => setState((previous) => ({ ...previous, error })),
    submitBooking,
    clearBooking,
    setBookingResult: (bookingResult) => setState((previous) => ({ ...previous, bookingResult }))
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export default BookingContext;
