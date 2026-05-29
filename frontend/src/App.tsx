import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import MovieDetail from "./pages/MovieDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{backgroundColor: "#141414"}} className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;