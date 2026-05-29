import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import axios from "axios";

interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  poster_url: string | null;
  overview: string | null;
  release_year: number | null;
  rating: number | null;
  comment: string | null;
  status: string;
}

export default function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filter, setFilter] = useState<string>("watched");
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get("hhttps://movie-tracker-backend-acc8.onrender.com/movies/", {
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

  const handleDelete = (id: number) => {
    setMovies(movies.filter((m) => m.id !== id));
  };

  const handleUpdate = (id: number, rating: number | null, comment: string) => {
    setMovies(movies.map((m) =>
      m.id === id ? { ...m, rating, comment } : m
    ));
  };

  const handleStatusChange = (id: number, status: string) => {
    setMovies(movies.map((m) =>
      m.id === id ? { ...m, status } : m
    ));
  };

  const filteredMovies = movies.filter((m) => m.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-dark">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">My List</h1>
          <button
            onClick={() => navigate("/search")}
            className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-zinc-200 transition duration-200"
          >
            + Add Movie
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          {["watched", "watchlist"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition duration-200 ${
                filter === f
                  ? "bg-white text-black"
                  : "border border-zinc-500 text-zinc-300 hover:border-white hover:text-white"
              }`}
            >
              {f === "watched" ? "Watched" : "Watchlist"}
            </button>
          ))}
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-8xl">🎬</span>
            <p className="text-zinc-400 text-xl mt-4">
              {filter === "watched" ? "No watched movies yet." : "Your watchlist is empty."}
            </p>
            <button
              onClick={() => navigate("/search")}
              className="mt-6 bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded font-bold transition duration-200"
            >
              Find something to watch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredMovies.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}