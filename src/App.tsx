// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Top10 from "./pages/Top10";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Search from "./pages/Search";
import CreatePlaylist from "./pages/CreatePlaylist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login / cadastro */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home em / e /home (Home já redireciona pra /login se não tiver token) */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Outras páginas logadas */}
        <Route path="/top10" element={<Top10 />} />
        <Route path="/library" element={<Library />} />
        <Route path="/likedsongs" element={<LikedSongs />} />
        <Route path="/search" element={<Search />} />
        <Route path="/createplaylist" element={<CreatePlaylist />} />

        {/* Painel admin */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
