import { useState } from "react";
import { addTheatre } from "../../../services/api";

export default function TheatresSection({ theatres, onSuccess, onError, clearStatus }) {
  const [theatreName, setTheatreName] = useState("");
  const [theatreLocation, setTheatreLocation] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearStatus();

    try {
      await addTheatre({ name: theatreName, location: theatreLocation });
      setTheatreName("");
      setTheatreLocation("");
      await onSuccess("Theatre added successfully");
    } catch (err) {
      onError(err, "Failed to add theatre");
    }
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-black">Theatres</h2>
        <p className="text-sm text-[#af8782] mt-1">Independent module: add theatre locations before creating screens.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form className="glass-panel rounded-xl p-6 border border-white/10 space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-xl font-black">Add Theatre</h3>
          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Theatre name"
            value={theatreName}
            onChange={(event) => setTheatreName(event.target.value)}
            required
          />
          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Location"
            value={theatreLocation}
            onChange={(event) => setTheatreLocation(event.target.value)}
            required
          />
          <button className="bg-[#e50914] text-white px-4 py-2 rounded-lg font-bold" type="submit">
            Create Theatre
          </button>
        </form>

        <section className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
          <h3 className="text-xl font-black">Theatre List</h3>
          <div className="space-y-3 max-h-[460px] overflow-auto pr-1">
            {theatres.length === 0 && <p className="text-[#af8782] text-sm">No theatres available.</p>}

            {theatres.map((theatre) => (
              <div
                key={theatre.theatreId ?? theatre.id}
                className="border border-white/10 rounded-lg p-3"
              >
                <p className="font-bold">{theatre.name}</p>
                <p className="text-sm text-[#af8782]">{theatre.location}</p>
                <p className="text-xs text-[#af8782] mt-1">ID: {theatre.theatreId ?? theatre.id}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
