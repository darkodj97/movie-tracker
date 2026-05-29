import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = (): string | null => {
    if (username.length < 3) return "Username must be at least 3 characters";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await axios.post("hhttps://movie-tracker-backend-acc8.onrender.com/users/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #141414 0%, #1a0a0a 50%, #2d0a0a 100%)"
      }}
    >
      <div className="w-full max-w-md bg-black bg-opacity-80 p-12 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-netflix-red font-bold text-3xl tracking-wider mb-2">MOVIE TRACKER</h1>
        </div>
        <h2 className="text-3xl font-bold text-white mb-8">Sign Up</h2>
        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username (min. 3 characters)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
            required
          />
          <input
            type="password"
            placeholder="Password (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
            required
          />
          <button
            type="submit"
            className="w-full py-4 bg-netflix-red hover:bg-red-700 text-white font-bold rounded text-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}