import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";

export default function HomePage({ bookingFlow }) {
  const navigate = useNavigate();

  const handleMovieSelect = (movie) => {
    bookingFlow.setSelectedMovie(movie);
    navigate("/theatre");
  };

  return (
    <section>
      <Alert type="error" message={bookingFlow.catalogError} />
      <section className="relative h-[70vh] w-full overflow-hidden rounded-xl">
        <img
          alt="Cinematic background"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZqyP2AR_yfiYWYBQ6KcTdvaBjitFvporzhV2oe5LdXHB37CT2SOtX9oRkWJwh7jEmQnYZMriQq-1AUKdEEKB92GDloOwGL1eoHg9juuDBBQkNKjMgpCpLsVGAFaFz9PvD7KtGI3xpOjYWfvFYuIDK8SLtISnUPKOcT6v_gF2Wb75YhzpDdI22HbSfEh93EX3QGiMc3RmShhWEHTUfOKthltKJd2pScm9oLCnzCrHrVX7gWQsyv5yG6ASrQKAAiWvo9R0Zz0LaYAw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-8">
          <span className="w-fit bg-red-900/40 text-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-red-700/40">
            Now Streaming
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-4">NOCTURNAL ECHOES</h1>
          <p className="max-w-2xl text-zinc-300 mt-4">
            In a world where memories are traded like currency, one detective must find the fragment of his past.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-black tracking-tight">Now Showing</h2>
        </div>
        {bookingFlow.isLoadingCatalog ? (
          <Loader label="Loading movies..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {bookingFlow.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onSelect={handleMovieSelect} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
