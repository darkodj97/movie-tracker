import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface SearchResult {
  tmdb_id: number;
  title: string;
  poster_url: string | null;
  overview: string | null;
  release_year: number | null;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [added, setAdded] = useState<number[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      searchMovies();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const searchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/movies/search", {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data);
    } catch (err) {
      console.error("Error searching movies");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (movie: SearchResult, status: string) => {
    setAddingId(movie.tmdb_id);
    try {
      await axios.post(
        "http://localhost:8000/movies/",
        {
          tmdb_id: movie.tmdb_id,
          title: movie.title,
          poster_url: movie.poster_url,
          overview: movie.overview,
          release_year: movie.release_year,
          status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdded([...added, movie.tmdb_id]);
    } catch (err) {
      console.error("Error adding movie");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: "#141414"}}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Search Movies</h1>

        <div className="relative mb-10">
          <input
            type="text"
            placeholder="Search for a movie or TV show..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-800 text-white rounded border border-zinc-600 focus:outline-none focus:border-white text-lg"
            autoFocus
          />
          {loading && (
            <div className="absolute right-4 top-4">
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          )}
        </div>

        {query.length < 2 && (
          <div className="text-center py-20">
            <span className="text-8xl">🎬</span>
            <p className="text-zinc-400 text-xl mt-4">Start typing to search for movies...</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {results.map((movie) => (
            <div
              key={movie.tmdb_id}
              className="relative group rounded-md overflow-hidden"
            >
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-zinc-800 flex items-center justify-center">
                  <span className="text-4xl">🎬</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-80 transition duration-200 flex flex-col justify-end p-3">
                <p className="text-white font-bold text-xs mb-1 opacity-0 group-hover:opacity-100 transition duration-200">
                  {movie.title}
                </p>
                {movie.release_year && (
                  <p className="text-zinc-400 text-xs mb-2 opacity-0 group-hover:opacity-100 transition duration-200">
                    {movie.release_year}
                  </p>
                )}
                {added.includes(movie.tmdb_id) ? (
                  <p className="text-green-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition duration-200">
                    ✓ Added
                  </p>
                ) : (
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition duration-200">
                    <button
                      onClick={() => handleAdd(movie, "watched")}
                      disabled={addingId === movie.tmdb_id}
                      className="w-full py-1 bg-white text-black text-xs font-bold rounded hover:bg-zinc-200 transition duration-200 disabled:opacity-50"
                    >
                      + Watched
                    </button>
                    <button
                      onClick={() => handleAdd(movie, "watchlist")}
                      disabled={addingId === movie.tmdb_id}
                      className="w-full py-1 bg-netflix-red text-white text-xs font-bold rounded hover:bg-red-700 transition duration-200 disabled:opacity-50"
                    >
                      + Watchlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}