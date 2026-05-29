import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

interface CastMember {
  name: string;
  character: string | null;
  profile_url: string | null;
}

export default function MovieDetail() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMovie = async () => {
    try {
      const response = await axios.get(`hhttps://movie-tracker-backend-acc8.onrender.com/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovie(response.data);
      fetchCast(response.data.tmdb_id);
    } catch (err) {
      console.error("Error fetching movie");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchCast = async (tmdbId: number) => {
    try {
      const response = await axios.get(`hhttps://movie-tracker-backend-acc8.onrender.com/movies/cast/${tmdbId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCast(response.data);
    } catch (err) {
      console.error("Error fetching cast");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-dark flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-netflix-dark">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-zinc-400 hover:text-white mb-8 flex items-center gap-2 transition duration-200"
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {movie.poster_url ? (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-48 h-72 object-cover rounded-lg flex-shrink-0"
            />
          ) : (
            <div className="w-48 h-72 bg-zinc-800 flex items-center justify-center rounded-lg flex-shrink-0">
              <span className="text-6xl">🎬</span>
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.release_year && (
              <p className="text-zinc-400 mb-4">{movie.release_year}</p>
            )}
            <span className={`text-sm px-3 py-1 rounded-full mb-4 inline-block ${
              movie.status === "watched"
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white"
            }`}>
              {movie.status === "watched" ? "✓ Watched" : "⏳ Watchlist"}
            </span>

            {movie.overview && (
              <div className="mb-6">
                <h2 className="text-white font-bold mb-2">Overview</h2>
                <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>
              </div>
            )}

            {movie.rating && (
              <div className="mb-4">
                <h2 className="text-white font-bold mb-2">My Rating</h2>
                <p className="text-yellow-400 text-2xl font-bold">⭐ {movie.rating}/10</p>
              </div>
            )}

            {movie.comment && (
              <div className="mb-4">
                <h2 className="text-white font-bold mb-2">My Review</h2>
                <p className="text-zinc-300 italic">"{movie.comment}"</p>
              </div>
            )}

            {!movie.rating && !movie.comment && movie.status === "watched" && (
              <p className="text-zinc-500 italic">No rating or review yet. Go back and rate this movie!</p>
            )}
          </div>
        </div>

        {cast.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
              {cast.map((member, i) => (
                <div key={i} className="text-center">
                  {member.profile_url ? (
                    <img
                      src={member.profile_url}
                      alt={member.name}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  ) : (
                    <div className="w-full h-24 bg-zinc-800 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                  <p className="text-white text-xs font-bold truncate">{member.name}</p>
                  {member.character && (
                    <p className="text-zinc-400 text-xs truncate">{member.character}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}