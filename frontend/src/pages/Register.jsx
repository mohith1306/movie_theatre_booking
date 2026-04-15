import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { registerUser } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
        admin: false
      });
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto glass-panel rounded-xl p-8 border border-white/10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Create Account</h1>
      <p className="text-[#af8782] mb-6">Join us to start booking your favorite movies.</p>
      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} />}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#ffb4aa] transition-colors"
          placeholder="Full Name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={isSubmitting}
          required
        />
        <input
          className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#ffb4aa] transition-colors"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
        <input
          className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#ffb4aa] transition-colors"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={isSubmitting}
          required
        />
        <button
          className="w-full bg-gradient-to-r from-[#e50914] to-[#c0000c] text-white py-4 rounded-xl font-black disabled:opacity-60 hover:shadow-lg transition-shadow"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader label="Creating account..." /> : "Register"}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-[#af8782]">
        Already have an account?{" "}
        <Link to="/login" className="text-[#ffb4aa] hover:underline font-semibold">
          Login here
        </Link>
      </div>
    </section>
  );
}
