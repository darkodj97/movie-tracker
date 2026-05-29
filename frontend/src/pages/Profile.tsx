import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface Movie {
  id: number;
  title: string;
  poster_url: string | null;
  release_year: number | null;
  rating: number | null;
  status: string;
}

export default function Profile() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMovies();
  }, [token]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get("https://movie-tracker-backend-acc8.onrender.com/movies/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(response.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const watched = movies.filter((m) => m.status === "watched");
  const watchlist = movies.filter((m) => m.status === "watchlist");
  const rated = watched.filter((m) => m.rating !== null);
  const avgRating = rated.length
    ? (rated.reduce((sum, m) => sum + (m.rating || 0), 0) / rated.length).toFixed(1)
    : null;
  const topRated = [...rated].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-dark">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-800 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-green-500">{watched.length}</p>
            <p className="text-zinc-400 mt-1 text-sm">Watched</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-netflix-red">{watchlist.length}</p>
            <p className="text-zinc-400 mt-1 text-sm">Watchlist</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-yellow-400">{avgRating || "-"}</p>
            <p className="text-zinc-400 mt-1 text-sm">Avg Rating</p>
          </div>
        </div>

        {topRated.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">⭐ Top Rated</h2>
            <div className="grid grid-cols-3 gap-4">
              {topRated.map((movie, i) => (
                <div key={movie.id} className="relative rounded-md overflow-hidden">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-zinc-800 flex items-center justify-center">
                      <span className="text-4xl">🎬</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 rounded px-2 py-1">
                    <span className="text-white font-bold text-sm">{["🥇", "🥈", "🥉"][i]}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2">
                    <p className="text-white text-xs font-bold truncate">{movie.title}</p>
                    <p className="text-yellow-400 text-xs">⭐ {movie.rating}/10</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}