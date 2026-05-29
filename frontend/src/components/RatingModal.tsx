import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Movie {
  id: number;
  title: string;
  poster_url: string | null;
  rating: number | null;
  comment: string | null;
}

interface RatingModalProps {
  movie: Movie;
  onClose: () => void;
  onUpdate: (id: number, rating: number | null, comment: string) => void;
}

export default function RatingModal({ movie, onClose, onUpdate }: RatingModalProps) {
  const [rating, setRating] = useState<number>(movie.rating || 0);
  const [comment, setComment] = useState(movie.comment || "");
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await axios.put(
        `https://movie-tracker-backend-acc8.onrender.com/movies/${movie.id}`,
        { rating: rating || null, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(movie.id, rating || null, comment);
      onClose();
    } catch (err) {
      console.error("Error updating rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-lg p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-6">
          {movie.poster_url && (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-16 h-24 object-cover rounded"
            />
          )}
          <h2 className="text-white font-bold text-xl">{movie.title}</h2>
        </div>

        <div className="mb-6">
          <label className="block text-zinc-400 mb-3">Rating</label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`w-10 h-10 rounded font-bold transition duration-200 ${
                  rating === n
                    ? "bg-yellow-400 text-black"
                    : "bg-zinc-700 text-white hover:bg-zinc-600"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-yellow-400 mt-2 text-sm">⭐ {rating}/10</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-zinc-400 mb-2">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think?"
            className="w-full px-4 py-3 bg-zinc-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-netflix-red h-24 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded font-bold transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 bg-netflix-red hover:bg-red-700 text-white rounded font-bold transition duration-200 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}