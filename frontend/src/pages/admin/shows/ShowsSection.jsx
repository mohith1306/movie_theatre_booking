import { useEffect, useMemo, useState } from "react";
import { addShow, getAdminScreens } from "../../../services/api";

function toIsoShowTime(value) {
  if (!value || !String(value).trim()) {
    throw new Error("Please choose show date and time");
  }

  const raw = String(value).trim();

  // Expected by datetime-local input: yyyy-MM-ddTHH:mm
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  // Fallback for manually typed values like dd-MM-yyyy HH:mm
  const fallbackMatch = raw.match(/^(\d{2})-(\d{2})-(\d{4})[ T](\d{2}):(\d{2})$/);
  if (fallbackMatch) {
    const [, day, month, year, hours, minutes] = fallbackMatch;
    const normalized = `${year}-${month}-${day}T${hours}:${minutes}`;
    const date = new Date(normalized);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  throw new Error("Invalid show time. Please use the date-time picker.");
}

export default function ShowsSection({ movies, theatres, onSuccess, onError, clearStatus }) {
  const [selectedMovieName, setSelectedMovieName] = useState("");
  const [selectedTheatreId, setSelectedTheatreId] = useState("");
  const [selectedScreenId, setSelectedScreenId] = useState("");
  const [showTime, setShowTime] = useState("");
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    if (!selectedMovieName && movies.length > 0) {
      setSelectedMovieName(movies[0].title);
    }
  }, [movies, selectedMovieName]);

  useEffect(() => {
    if (!selectedTheatreId && theatres.length > 0) {
      setSelectedTheatreId(String(theatres[0].theatreId ?? theatres[0].id));
    }
  }, [theatres, selectedTheatreId]);

  useEffect(() => {
    const loadScreens = async () => {
      if (!selectedTheatreId) {
        setScreens([]);
        setSelectedScreenId("");
        return;
      }

      try {
        const list = await getAdminScreens(Number(selectedTheatreId));
        const normalized = Array.isArray(list) ? list : [];
        setScreens(normalized);

        if (!selectedScreenId && normalized.length > 0) {
          setSelectedScreenId(String(normalized[0].screenId));
        }
      } catch {
        setScreens([]);
        setSelectedScreenId("");
      }
    };

    loadScreens();
  }, [selectedTheatreId]);

  const selectedMovie = useMemo(
    () => movies.find((movie) => movie.title === selectedMovieName),
    [movies, selectedMovieName]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearStatus();

    const screenId = Number(selectedScreenId);
    if (!Number.isInteger(screenId) || screenId <= 0) {
      onError(new Error("Please select a valid screen"));
      return;
    }

    try {
      const showTimeIso = toIsoShowTime(showTime);

      await addShow({
        screenId,
        movieName: selectedMovieName,
        showTime: showTimeIso
      });

      setShowTime("");
      await onSuccess("Show added successfully");
    } catch (err) {
      onError(err, "Failed to add show");
    }
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-black">Shows</h2>
        <p className="text-sm text-[#af8782] mt-1">Dependent module: select movie, theatre, and screen before scheduling date/time.</p>
      </div>

      <form className="glass-panel rounded-xl p-6 border border-white/10 space-y-4" onSubmit={handleSubmit}>
        <h3 className="text-xl font-black">Add Show</h3>

        <label className="block text-sm text-[#af8782]">Select Movie</label>
        <select
          className="w-full bg-[#1f1f1f] border border-white/20 py-2 px-2 rounded-lg outline-none"
          value={selectedMovieName}
          onChange={(event) => setSelectedMovieName(event.target.value)}
          required
        >
          {movies.map((movie) => (
            <option key={movie.id} value={movie.title}>
              {movie.title}
            </option>
          ))}
        </select>

        <label className="block text-sm text-[#af8782]">Select Theatre</label>
        <select
          className="w-full bg-[#1f1f1f] border border-white/20 py-2 px-2 rounded-lg outline-none"
          value={selectedTheatreId}
          onChange={(event) => {
            setSelectedTheatreId(event.target.value);
            setSelectedScreenId("");
          }}
          required
        >
          {theatres.map((theatre) => (
            <option key={theatre.theatreId ?? theatre.id} value={theatre.theatreId ?? theatre.id}>
              {theatre.name}
            </option>
          ))}
        </select>

        <label className="block text-sm text-[#af8782]">Select Screen</label>
        <select
          className="w-full bg-[#1f1f1f] border border-white/20 py-2 px-2 rounded-lg outline-none"
          value={selectedScreenId}
          onChange={(event) => setSelectedScreenId(event.target.value)}
          required
        >
          {screens.map((screen) => (
            <option key={screen.screenId} value={screen.screenId}>
              {screen.screenName}
            </option>
          ))}
        </select>

        <label className="block text-sm text-[#af8782]">Show Date & Time</label>
        <input
          className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
          type="datetime-local"
          step="60"
          value={showTime}
          onChange={(event) => setShowTime(event.target.value)}
          required
        />

        <div className="rounded-lg border border-white/10 p-3 bg-black/20 text-sm text-[#af8782]">
          <p>Selected Movie ID: {selectedMovie?.id ?? "-"}</p>
          <p>Selected Theatre ID: {selectedTheatreId || "-"}</p>
          <p>Selected Screen ID: {selectedScreenId || "-"}</p>
        </div>

        <button className="bg-[#e50914] text-white px-4 py-2 rounded-lg font-bold" type="submit">
          Create Show
        </button>
      </form>
    </section>
  );
}
