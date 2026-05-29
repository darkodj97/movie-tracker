import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import RatingModal from "./RatingModal";

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

interface MovieCardProps {
  movie: Movie;
  onDelete: (id: number) => void;
  onUpdate: (id: number, rating: number | null, comment: string) => void;
  onStatusChange: (id: number, status: string) => void;
}

export default function MovieCard({ movie, onDelete, onUpdate, onStatusChange }: MovieCardProps) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Remove this movie?")) return;
    try {
      await axios.delete(`https://movie-tracker-backend-acc8.onrender.com/movies/${movie.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(movie.id);
    } catch (err) {
      console.error("Error deleting movie");
    }
  };

  const handleMarkAsWatched = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.put(
        `https://movie-tracker-backend-acc8.onrender.com/movies/${movie.id}`,
        { status: "watched" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusChange(movie.id, "watched");
    } catch (err) {
      console.error("Error updating status");
    }
  };

  return (
    <>
      <div
        className="relative rounded-md overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-zinc-800 flex items-center justify-center">
            <span className="text-6xl">🎬</span>
          </div>
        )}

        {hovered && (
          <div className="absolute inset-0 bg-black bg-opacity-80 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-sm mb-1">{movie.title}</h3>
              {movie.release_year && (
                <p className="text-zinc-400 text-xs mb-2">{movie.release_year}</p>
              )}
              {movie.overview && (
                <p className="text-zinc-300 text-xs line-clamp-3">{movie.overview}</p>
              )}
            </div>
            <div>
              {movie.rating && (
                <p className="text-yellow-400 text-sm font-bold mb-2">⭐ {movie.rating}/10</p>
              )}
              <span className={`text-xs px-2 py-1 rounded mb-2 inline-block ${
                movie.status === "watched"
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white"
              }`}>
                {movie.status === "watched" ? "Watched" : "Watchlist"}
              </span>
              <div className="flex flex-col gap-1 mt-2">
                {movie.status === "watchlist" && (
                  <button
                    onClick={handleMarkAsWatched}
                    className="w-full py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded transition duration-200"
                  >
                    ✓ Mark as Watched
                  </button>
                )}
                {movie.status === "watched" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                    className="w-full py-1 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded transition duration-200"
                  >
                    ⭐ Rate
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="w-full py-1 bg-netflix-red hover:bg-red-700 text-white text-xs font-bold rounded transition duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <RatingModal
          movie={movie}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}