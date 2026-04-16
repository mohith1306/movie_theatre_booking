import { useEffect, useState } from "react";
import { addSeat, getAdminScreens, setSeatMaintenance } from "../../../services/api";

export default function SeatsSection({ theatres, onSuccess, onError, clearStatus }) {
  const [selectedTheatreId, setSelectedTheatreId] = useState("");
  const [selectedScreenId, setSelectedScreenId] = useState("");
  const [screens, setScreens] = useState([]);

  const [seatNumber, setSeatNumber] = useState("");
  const [seatType, setSeatType] = useState("REGULAR");

  const [maintenanceSeatId, setMaintenanceSeatId] = useState("");
  const [maintenanceValue, setMaintenanceValue] = useState("true");

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
      }
    };

    loadScreens();
  }, [selectedTheatreId]);

  const handleAddSeat = async (event) => {
    event.preventDefault();
    clearStatus();

    const screenId = Number(selectedScreenId);
    if (!Number.isInteger(screenId) || screenId <= 0) {
      onError(new Error("Please select a valid screen"));
      return;
    }

    try {
      await addSeat({
        screenId,
        seatNumber,
        type: seatType
      });

      setSeatNumber("");
      await onSuccess("Seat added successfully");
    } catch (err) {
      onError(err, "Failed to add seat");
    }
  };

  const handleMaintenance = async (event) => {
    event.preventDefault();
    clearStatus();

    const seatId = Number(maintenanceSeatId);
    if (!Number.isInteger(seatId) || seatId <= 0) {
      onError(new Error("Seat ID must be a valid number"));
      return;
    }

    try {
      await setSeatMaintenance(seatId, maintenanceValue === "true");
      await onSuccess("Seat maintenance status updated");
    } catch (err) {
      onError(err, "Failed to update seat maintenance");
    }
  };

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-black">Seats</h2>
        <p className="text-sm text-[#af8782] mt-1">Dependent module: seats belong to a screen, which belongs to a theatre.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form className="glass-panel rounded-xl p-6 border border-white/10 space-y-4" onSubmit={handleAddSeat}>
          <h3 className="text-xl font-black">Add Seat</h3>

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

          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            placeholder="Seat number (e.g. C7)"
            value={seatNumber}
            onChange={(event) => setSeatNumber(event.target.value)}
            required
          />

          <select
            className="w-full bg-[#1f1f1f] border border-white/20 py-2 px-2 rounded-lg outline-none"
            value={seatType}
            onChange={(event) => setSeatType(event.target.value)}
          >
            <option value="REGULAR">REGULAR</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="RECLINER">RECLINER</option>
          </select>

          <button className="bg-[#e50914] text-white px-4 py-2 rounded-lg font-bold" type="submit">
            Create Seat
          </button>
        </form>

        <form className="glass-panel rounded-xl p-6 border border-white/10 space-y-4" onSubmit={handleMaintenance}>
          <h3 className="text-xl font-black">Seat Maintenance</h3>
          <p className="text-sm text-[#af8782]">Optional action by seat ID for maintenance workflows.</p>

          <input
            className="w-full bg-transparent border-b border-white/20 py-2 outline-none"
            type="number"
            min="1"
            placeholder="Seat ID"
            value={maintenanceSeatId}
            onChange={(event) => setMaintenanceSeatId(event.target.value)}
            required
          />

          <select
            className="w-full bg-[#1f1f1f] border border-white/20 py-2 px-2 rounded-lg outline-none"
            value={maintenanceValue}
            onChange={(event) => setMaintenanceValue(event.target.value)}
          >
            <option value="true">UNDER_MAINTENANCE</option>
            <option value="false">AVAILABLE</option>
          </select>

          <button className="bg-[#e50914] text-white px-4 py-2 rounded-lg font-bold" type="submit">
            Update Seat
          </button>
        </form>
      </div>
    </section>
  );
}
