import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-black px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-netflix-red font-bold text-2xl no-underline tracking-wider">
        MOVIE TRACKER
      </Link>
      {user && (
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-white hover:text-zinc-300 transition duration-200 no-underline text-sm">
            Home
          </Link>
          <Link to="/search" className="text-white hover:text-zinc-300 transition duration-200 no-underline text-sm">
            Search
          </Link>
          <Link to="/profile" className="text-white hover:text-zinc-300 transition duration-200 no-underline text-sm">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-white hover:text-zinc-300 transition duration-200 text-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}