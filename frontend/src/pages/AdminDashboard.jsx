import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBooking from "../hooks/useBooking";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { createMovie, createTheatre, deleteMovie, deleteTheatre, getMovies, getTheatres, updateMovie, updateTheatre } from "../services/api";

const emptyMovieForm = {
  title: "",
  genre: "",
  duration: "",
  rating: "",
  thumbnailUrl: ""
};

const emptyTheatreForm = {
  name: "",
  location: ""
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, clearBooking } = useBooking();
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [movieForm, setMovieForm] = useState(emptyMovieForm);
  const [theatreForm, setTheatreForm] = useState(emptyTheatreForm);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editingTheatreId, setEditingTheatreId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingMovie, setIsSavingMovie] = useState(false);
  const [isSavingTheatre, setIsSavingTheatre] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [movieResponse, theatreResponse] = await Promise.all([getMovies(), getTheatres()]);
        setMovies(movieResponse);
        setTheatres(theatreResponse);
      } catch (loadError) {
        setError(loadError?.response?.data?.message || "Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const reloadData = async () => {
    const [movieResponse, theatreResponse] = await Promise.all([getMovies(), getTheatres()]);
    setMovies(movieResponse);
    setTheatres(theatreResponse);
  };

  const handleLogout = () => {
    logout();
    clearBooking();
    navigate("/admin/login");
  };

  const beginMovieEdit = (movie) => {
    setEditingMovieId(movie.movieId ?? movie.id);
    setMovieForm({
      title: movie.title ?? movie.movieName ?? "",
      genre: movie.genre ?? "",
      duration: movie.duration ?? "",
      rating: movie.rating ?? "",
      thumbnailUrl: movie.thumbnailUrl ?? ""
    });
  };

  const beginTheatreEdit = (theatre) => {
    setEditingTheatreId(theatre.theatreId ?? theatre.id);
    setTheatreForm({
      name: theatre.name ?? "",
      location: theatre.location ?? ""
    });
  };

  const resetMovieForm = () => {
    setEditingMovieId(null);
    setMovieForm(emptyMovieForm);
  };

  const resetTheatreForm = () => {
    setEditingTheatreId(null);
    setTheatreForm(emptyTheatreForm);
  };

  const handleMovieSubmit = async (event) => {
    event.preventDefault();
    setIsSavingMovie(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingMovieId) {
        await updateMovie(editingMovieId, movieForm);
        setSuccessMessage("Movie updated successfully");
      } else {
        await createMovie(movieForm);
        setSuccessMessage("Movie added successfully");
      }

      resetMovieForm();
      await reloadData();
    } catch (saveError) {
      setError(saveError?.response?.data?.message || "Failed to save movie");
    } finally {
      setIsSavingMovie(false);
    }
  };

  const handleTheatreSubmit = async (event) => {
    event.preventDefault();
    setIsSavingTheatre(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingTheatreId) {
        await updateTheatre(editingTheatreId, theatreForm);
        setSuccessMessage("Theatre updated successfully");
      } else {
        await createTheatre(theatreForm);
        setSuccessMessage("Theatre added successfully");
      }

      resetTheatreForm();
      await reloadData();
    } catch (saveError) {
      setError(saveError?.response?.data?.message || "Failed to save theatre");
    } finally {
      setIsSavingTheatre(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm("Delete this movie? This will archive any linked shows.")) {
      return;
    }

    try {
      await deleteMovie(movieId);
      setSuccessMessage("Movie deleted successfully");
      await reloadData();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Failed to delete movie");
    }
  };

  const handleDeleteTheatre = async (theatreId) => {
    if (!window.confirm("Delete this theatre? All linked screens and shows will be removed.")) {
      return;
    }

    try {
      await deleteTheatre(theatreId);
      setSuccessMessage("Theatre deleted successfully");
      await reloadData();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Failed to delete theatre");
    }
  };

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full border border-[#5e3f3b] text-xs font-bold text-[#ffb4aa] uppercase tracking-[0.2em]">
            Admin Dashboard
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-4">Catalog Control Room</h1>
          <p className="text-[#af8782] mt-2 max-w-2xl">
            Manage movies and theatres from one place. The dashboard talks to the secured admin APIs directly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8f8a88]">Signed in as</p>
            <p className="font-bold text-[#e5e2e1]">{user?.name}</p>
          </div>
          <button
            className="px-4 py-3 rounded-xl border border-white/10 bg-[#353534] text-white font-bold hover:bg-[#454544] transition-colors"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      {isLoading ? (
        <Loader label="Loading admin data..." />
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <section className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Movies</h2>
                <p className="text-sm text-[#af8782]">Add, update, or retire movie titles.</p>
              </div>
              {editingMovieId && (
                <button className="text-sm font-semibold text-[#ffb4aa] hover:underline" type="button" onClick={resetMovieForm}>
                  Cancel edit
                </button>
              )}
            </div>

            <form className="grid gap-4" onSubmit={handleMovieSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <input className="bg-[#131313] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ffb4aa]" placeholder="Title" value={movieForm.title} onChange={(event) => setMovieForm((previous) => ({ ...previous, title: event.target.value }))} required />
                <input className="bg-[#131313] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ffb4aa]" placeholder="Genre" value={movieForm.genre} onChange={(event) => setMovieForm((previous) => ({ ...previous, genre: event.target.value }))} required />
                <input className="bg-[#131313] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ffb4aa]" placeholder="Duration" value={movieForm.duration} onChange={(event) => setMovieForm((previous) => ({ ...previous, duration: event.target.value }))} required />
                <input className="bg-[#131313] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ffb4aa]" placeholder="Rating" value={movieForm.rating} onChange={(event) => setMovieForm((previous) => ({ ...previous, rating: event.target.value }))} required />
              </div>
              <input className="bg-[#131313] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ffb4aa]" placeholder="Thumbnail URL" value={movieForm.thumbnailUrl} onChange={(event) => setMovieForm((previous) => ({ ...previous, thumbnailUrl: event.target.value }))} required />
              <button className="bg-[#e50914] text-white font-black rounded-xl py-3.5 hover:shadow-lg transition-shadow disabled:opacity-60" type="submit" disabled={isSavingMovie}>
                {isSavingMovie ? "Saving..." : editingMovieId ? "Update Movie" : "Add Movie"}
              </button>
            </form>

            <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
              {movies.map((movie) => (
                <article key={movie.movieId ?? movie.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-white/10 bg-[#131313]">
                  <div>
                    <h3 className="font-bold text-lg">{movie.title}</h3>
                    <p className="text-sm text-[#af8782]">{movie.genre} · {movie.duration} · {movie.rating}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-lg bg-[#353534] hover:bg-[#454544] text-sm font-bold" type="button" onClick={() => beginMovieEdit(movie)}>
                      Edit
                    </button>
                    <button className="px-3 py-2 rounded-lg bg-[#3a1918] hover:bg-[#5b1f1d] text-sm font-bold text-[#ffb4aa]" type="button" onClick={() => handleDeleteMovie(movie.movieId ?? movie.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {movies.length === 0 && <p className="text-sm text-[#af8782]">No movies found.</p>}
            </div>
          </section>

          <section className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Theatres</h2>
                <p className="text-sm text-[#af8782]">Manage theatre names and locations.</p>
              </div>
              {editingTheatreId && (
                <button className="text-sm font-semibold text-[#ffb4aa] hover:underline" type="button" onClick={resetTheatreForm}>
                  Cancel edit
                </button>
              )}
            </div>

            <form className="grid gap-4" onSubmit={handleTheatreSubmit}>
              <input className="bg-[#131313] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ffb4aa]" placeholder="Theatre name" value={theatreForm.name} onChange={(event) => setTheatreForm((previous) => ({ ...previous, name: event.target.value }))} required />
              <input className="bg-[#131313] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ffb4aa]" placeholder="Location" value={theatreForm.location} onChange={(event) => setTheatreForm((previous) => ({ ...previous, location: event.target.value }))} required />
              <button className="bg-[#e50914] text-white font-black rounded-xl py-3.5 hover:shadow-lg transition-shadow disabled:opacity-60" type="submit" disabled={isSavingTheatre}>
                {isSavingTheatre ? "Saving..." : editingTheatreId ? "Update Theatre" : "Add Theatre"}
              </button>
            </form>

            <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
              {theatres.map((theatre) => (
                <article key={theatre.theatreId ?? theatre.id} className="flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-[#131313]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{theatre.name}</h3>
                      <p className="text-sm text-[#af8782]">{theatre.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 rounded-lg bg-[#353534] hover:bg-[#454544] text-sm font-bold" type="button" onClick={() => beginTheatreEdit(theatre)}>
                        Edit
                      </button>
                      <button className="px-3 py-2 rounded-lg bg-[#3a1918] hover:bg-[#5b1f1d] text-sm font-bold text-[#ffb4aa]" type="button" onClick={() => handleDeleteTheatre(theatre.theatreId ?? theatre.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[#8f8a88]">
                    {Array.isArray(theatre.shows) ? `${theatre.shows.length} show(s)` : "0 show(s)"}
                  </p>
                </article>
              ))}
              {theatres.length === 0 && <p className="text-sm text-[#af8782]">No theatres found.</p>}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}