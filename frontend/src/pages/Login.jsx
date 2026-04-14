import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import useBooking from "../hooks/useBooking";

export default function Login() {
  const navigate = useNavigate();
  const { login, error, setError } = useBooking();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await login(email, password);
      setSuccessMessage("Login successful");
      navigate("/");
    } catch {
      setError("Invalid login credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto glass-panel rounded-xl p-8 border border-white/10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Login</h1>
      <p className="text-[#af8782] mb-6">Sign in to continue booking.</p>
      <Alert type="error" message={error} />
      <Alert type="success" message={successMessage} />
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          className="w-full bg-transparent border-b border-white/20 py-3 outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="w-full bg-transparent border-b border-white/20 py-3 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          className="w-full bg-gradient-to-r from-[#e50914] to-[#c0000c] text-white py-4 rounded-xl font-black disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader label="Signing in..." /> : "Login"}
        </button>
      </form>
    </section>
  );
}
