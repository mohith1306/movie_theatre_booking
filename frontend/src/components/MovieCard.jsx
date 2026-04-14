export default function MovieCard({ movie, onSelect }) {
  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-4 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
        <img alt={movie.title} className="w-full h-full object-cover" src={movie.thumbnailUrl || movie.image} />
      </div>
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xl font-bold tracking-tight group-hover:text-[#ffb4aa] transition-colors">{movie.title}</h3>
        <span className="text-[#ffb4aa] font-black text-sm">{movie.rating}</span>
      </div>
      <div className="text-[#af8782] text-sm mb-4">
        {movie.duration} � {movie.genre}
      </div>
      <button
        className="w-full py-3 bg-[#353534] text-white font-bold rounded-xl hover:bg-[#e50914] transition-all"
        type="button"
        onClick={() => onSelect(movie)}
      >
        Book Now
      </button>
    </div>
  );
}
