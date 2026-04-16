import { useMemo, useState } from "react";
import Alert from "../../components/Alert";
import useBooking from "../../hooks/useBooking";
import AdminSidebar from "./admin/AdminSidebar";
import MoviesSection from "./movies/MoviesSection";
import TheatresSection from "./theatres/TheatresSection";
import ScreensSection from "./screens/ScreensSection";
import ShowsSection from "./shows/ShowsSection";

const SECTIONS = [
  { id: "movies", label: "Movies" },
  { id: "theatres", label: "Theatres" },
  { id: "screens", label: "Screens" },
  { id: "shows", label: "Shows" }
];

export default function AdminDashboard() {
  const { movies, theatres, refreshCatalog } = useBooking();
  const [activeSection, setActiveSection] = useState("movies");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  const handleSuccess = async (successMessage) => {
    setError("");
    setMessage(successMessage || "Operation completed");
    await refreshCatalog();
  };

  const handleError = (err, fallback = "Admin operation failed") => {
    setMessage("");
    setError(err?.response?.data?.message || err?.message || fallback);
  };

  const sectionContent = useMemo(() => {
    const commonProps = {
      movies,
      theatres,
      onSuccess: handleSuccess,
      onError: handleError,
      clearStatus
    };

    switch (activeSection) {
      case "movies":
        return <MoviesSection {...commonProps} />;
      case "theatres":
        return <TheatresSection {...commonProps} />;
      case "screens":
        return <ScreensSection {...commonProps} />;
      case "shows":
        return <ShowsSection {...commonProps} />;
      default:
        return null;
    }
  }, [activeSection, movies, theatres]);

  return (
    <section className="max-w-7xl mx-auto space-y-6">
      <header className="glass-panel rounded-xl p-6 border border-white/10">
        <h1 className="text-3xl font-black tracking-tighter">Admin Control Center</h1>
        <p className="text-[#af8782] mt-2">Manage movies, theatres, screens, seats, and shows in a structured workflow.</p>
      </header>

      <Alert type="success" message={message} />
      <Alert type="error" message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <AdminSidebar sections={SECTIONS} activeSection={activeSection} onSelect={setActiveSection} />
        </aside>

        <div className="lg:col-span-9">{sectionContent}</div>
      </div>
    </section>
  );
}
