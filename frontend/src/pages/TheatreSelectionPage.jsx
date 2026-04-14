import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

export default function TheatreSelectionPage({ bookingFlow }) {
  const navigate = useNavigate();
  const selectedMovieTitle = bookingFlow.selectedMovie?.title;

  const theatresToShow = bookingFlow.theatres.map((theatre) => ({
    ...theatre,
    shows: theatre.shows.filter((show) => !selectedMovieTitle || show.movieName === selectedMovieTitle)
  })).filter((theatre) => theatre.shows.length > 0);

  const onSelectShow = (theatre, show) => {
    bookingFlow.setSelectedTheatre(theatre);
    bookingFlow.setSelectedShowId(show.id);
    navigate("/seats");
  };

  return (
    <section className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">Theatre Selection</h1>
      <p className="text-[#af8782] mb-10">Choose theatre and show time from your database.</p>

      <Alert type="error" message={bookingFlow.catalogError} />

      {bookingFlow.isLoadingCatalog ? (
        <Loader label="Loading theatres..." />
      ) : (
        <div className="space-y-6">
          {theatresToShow.map((theatre) => (
            <div key={theatre.theatreId} className="p-6 rounded-xl bg-[#201f1f] border border-[#5e3f3b]/40">
              <h3 className="font-black text-lg uppercase tracking-tight">{theatre.name}</h3>
              <p className="text-[#af8782] text-sm mb-2">{theatre.location}</p>
              {selectedMovieTitle && (
                <p className="text-xs uppercase tracking-widest text-[#ffb4aa] mb-5">For {selectedMovieTitle}</p>
              )}
              <div className="flex flex-wrap gap-3">
                {theatre.shows.map((show) => (
                  <button
                    key={show.id}
                    type="button"
                    className="px-5 py-2.5 rounded-lg border border-[#5e3f3b]/50 text-sm font-bold bg-[#131313] hover:bg-[#353534] transition-colors"
                    onClick={() => onSelectShow(theatre, show)}
                  >
                    {show.formattedShowTime || show.showTime}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {theatresToShow.length === 0 && (
            <p className="text-[#af8782]">No shows found for the selected movie.</p>
          )}
        </div>
      )}
    </section>
  );
}
