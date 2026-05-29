import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      const response = await axios.post("https://movie-tracker-backend-acc8.onrender.com/users/login", formData);
      login(response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
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
        <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>
        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {loading && (
          <div className="bg-zinc-800 text-zinc-300 px-4 py-3 rounded mb-6 text-center">
            🔄 Connecting to server, please wait...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-netflix-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded text-lg transition duration-200"
          >
            {loading ? "Connecting..." : "Sign In"}
          </button>
        </form>
        <p className="text-zinc-400 mt-6">
          New to Movie Tracker?{" "}
          <Link to="/register" className="text-white font-bold hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}