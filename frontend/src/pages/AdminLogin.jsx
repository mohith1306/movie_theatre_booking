import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import useBooking from "../hooks/useBooking";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, user, error, setError } = useBooking();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (user?.role === "ADMIN") {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    if (!username || !password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await adminLogin(username, password);
      setSuccessMessage("Admin login successful! Redirecting...");
      setTimeout(() => {
        navigate("/admin");
      }, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid admin credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto glass-panel rounded-xl p-8 border border-white/10">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Admin Login</h1>
          <p className="text-[#af8782]">Use the admin username and password to open the dashboard.</p>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full border border-[#5e3f3b] text-xs font-bold text-[#ffb4aa] uppercase tracking-[0.2em]">
          Restricted
        </span>
      </div>
      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} />}
      <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
        <input
          className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#ffb4aa] transition-colors"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isSubmitting}
          required
        />
        <input
          className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#ffb4aa] transition-colors"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          required
        />
        <button
          className="w-full bg-gradient-to-r from-[#e50914] to-[#c0000c] text-white py-4 rounded-xl font-black disabled:opacity-60 hover:shadow-lg transition-shadow"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader label="Signing in..." /> : "Login to Admin Dashboard"}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-[#af8782]">
        Back to customer login?{" "}
        <Link to="/login" className="text-[#ffb4aa] hover:underline font-semibold">
          Login here
        </Link>
      </div>
    </section>
  );
}