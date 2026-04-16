import { useState } from "react";
import { addMovie, deleteMovie, uploadThumbnail } from "../../../services/api";

export default function MoviesSection({ movies, onSuccess, onError, clearStatus }) {
  const [movieName, setMovieName] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [movieDuration, setMovieDuration] = useState("");
  const [movieRating, setMovieRating] = useState("");
  const [movieThumbnailUrl, setMovieThumbnailUrl] = useState("");
  const [movieImageFile, setMovieImageFile] = useState(null);

  const resetForm = () => {
    setMovieName("");
    setMovieGenre("");
    setMovieDuration("");
    setMovieRating("");
    setMovieThumbnailUrl("");
    setMovieImageFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearStatus();

    try {
      let thumbnailUrl = movieThumbnailUrl.trim();

      if (movieImageFile) {
        const uploadResponse = await uploadThumbnail(movieImageFile);
        thumbnailUrl = uploadResponse?.thumbnailUrl || thumbnailUrl;
      }

      if (!thumbnailUrl) {
        thumbnailUrl = "/thumbnails/mi1.jpeg";
      }

      await addMovie({
        movieName,
        genre: movieGenre,
        duration: movieDuration,
        rating: movieRating,
        thumbnailUrl
      });

      resetForm();
      await onSuccess("Movie added successfully");
    } catch (err) {
      onError(err, "Failed to add movie");
    }
  };

  const handleDelete = async (movieId) => {
    clearStatus();
    try {
      await deleteMovie(movieId);
      await onSuccess("Movie deleted successfully");
    } catch (err) {
      onError(err, "Failed to delete movie");
    }
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-black">Movies</h2>
        <p className="text-sm text-[#af8782] mt-1">Independent module: create movies and manage catalog entries.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form className="glass-panel rounded-xl p-6 border border-white/10 space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-xl font-black">Add Movie</h3>

          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Movie name"
            value={movieName}
            onChange={(event) => setMovieName(event.target.value)}
            required
          />
          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Genre"
            value={movieGenre}
            onChange={(event) => setMovieGenre(event.target.value)}
            required
          />
          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Duration (e.g. 120 min)"
            value={movieDuration}
            onChange={(event) => setMovieDuration(event.target.value)}
            required
          />
          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Rating"
            value={movieRating}
            onChange={(event) => setMovieRating(event.target.value)}
            required
          />
          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            type="file"
            accept="image/*"
            onChange={(event) => setMovieImageFile(event.target.files?.[0] || null)}
          />
          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Or paste thumbnail URL (optional)"
            value={movieThumbnailUrl}
            onChange={(event) => setMovieThumbnailUrl(event.target.value)}
          />

          <button className="bg-[#e50914] text-white px-4 py-2 rounded-lg font-bold" type="submit">
            Create Movie
          </button>
        </form>

        <section className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
          <h3 className="text-xl font-black">Movie List</h3>
          <div className="space-y-3 max-h-[460px] overflow-auto pr-1">
            {movies.length === 0 && <p className="text-[#af8782] text-sm">No movies available.</p>}

            {movies.map((movie) => (
              <div key={movie.id} className="border border-white/10 rounded-lg p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{movie.title}</p>
                  <p className="text-xs text-[#af8782]">ID: {movie.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(movie.id)}
                  className="bg-[#3a1918] text-[#ffb4aa] px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#5b1f1d]"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
