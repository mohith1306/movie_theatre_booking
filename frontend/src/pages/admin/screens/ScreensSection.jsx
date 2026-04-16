import { useEffect, useState } from "react";
import { addScreen, getAdminScreens } from "../../../services/api";

export default function ScreensSection({ theatres, onSuccess, onError, clearStatus }) {
  const [selectedTheatreId, setSelectedTheatreId] = useState("");
  const [screenName, setScreenName] = useState("");
  const [screens, setScreens] = useState([]);

  useEffect(() => {
    if (!selectedTheatreId && theatres.length > 0) {
      setSelectedTheatreId(String(theatres[0].theatreId ?? theatres[0].id));
    }
  }, [theatres, selectedTheatreId]);

  useEffect(() => {
    const loadScreens = async () => {
      if (!selectedTheatreId) {
        setScreens([]);
        return;
      }

      try {
        const list = await getAdminScreens(Number(selectedTheatreId));
        setScreens(Array.isArray(list) ? list : []);
      } catch {
        setScreens([]);
      }
    };

    loadScreens();
  }, [selectedTheatreId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearStatus();

    const theatreId = Number(selectedTheatreId);
    if (!Number.isInteger(theatreId) || theatreId <= 0) {
      onError(new Error("Please select a valid theatre"));
      return;
    }

    try {
      await addScreen({ theatreId, screenName });
      setScreenName("");

      const list = await getAdminScreens(theatreId);
      setScreens(Array.isArray(list) ? list : []);

      await onSuccess("Screen added successfully");
    } catch (err) {
      onError(err, "Failed to add screen");
    }
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-black">Screens</h2>
        <p className="text-sm text-[#af8782] mt-1">Dependent module: each screen belongs to a selected theatre.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form className="glass-panel rounded-xl p-6 border border-white/10 space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-xl font-black">Add Screen</h3>

          <label className="block text-sm text-[#af8782]">Select Theatre</label>
          <select
            className="w-full bg-[#1f1f1f] border border-white/20 py-2 px-2 rounded-lg outline-none"
            value={selectedTheatreId}
            onChange={(event) => setSelectedTheatreId(event.target.value)}
            required
          >
            {theatres.map((theatre) => (
              <option key={theatre.theatreId ?? theatre.id} value={theatre.theatreId ?? theatre.id}>
                {theatre.name}
              </option>
            ))}
          </select>

          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Screen name"
            value={screenName}
            onChange={(event) => setScreenName(event.target.value)}
            required
          />

          <button className="bg-[#e50914] text-white px-4 py-2 rounded-lg font-bold" type="submit">
            Create Screen
          </button>
        </form>

        <section className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
          <h3 className="text-xl font-black">Screens In Selected Theatre</h3>
          <div className="space-y-3 max-h-[460px] overflow-auto pr-1">
            {screens.length === 0 && <p className="text-[#af8782] text-sm">No screens found for this theatre.</p>}

            {screens.map((screen) => (
              <div key={screen.screenId} className="border border-white/10 rounded-lg p-3">
                <p className="font-bold">{screen.screenName}</p>
                <p className="text-xs text-[#af8782] mt-1">ID: {screen.screenId}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
