import { Link, useNavigate } from "react-router-dom";
import useBooking from "../hooks/useBooking";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, clearBooking } = useBooking();

  const handleLogout = () => {
    logout();
    clearBooking();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-xl bg-gradient-to-b from-[#131313] to-transparent">
      <div className="flex justify-between items-center px-8 h-20 w-full">
        <div className="text-2xl font-black italic text-[#e50914] tracking-tighter">CineNoir</div>
        <div className="hidden md:flex gap-8 items-center font-bold tracking-tight">
          <Link className="text-[#ffb4aa] border-b-2 border-[#e50914] pb-1" to="/">Movies</Link>
          <Link className="text-[#e5e2e1] hover:text-[#ffb4aa] transition-colors" to="/theatre">Theatres</Link>
          <Link className="text-[#e5e2e1] hover:text-[#ffb4aa] transition-colors" to="/summary">Summary</Link>
          {!user && <Link className="text-[#e5e2e1] hover:text-[#ffb4aa] transition-colors" to="/login">Login</Link>}
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-[#af8782] hidden sm:inline">{user.name}</span>}
          {user ? (
            <button
              className="bg-[#e50914] text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-shadow"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link className="bg-[#353534] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#454544] transition-colors" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
