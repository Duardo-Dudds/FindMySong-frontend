// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Top10 from "./pages/Top10";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Search from "./pages/Search";
import CreatePlaylist from "./pages/CreatePlaylist";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login padrão */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Cadastro */}
        <Route path="/register" element={<Register />} />

        {/* Área logada */}
        <Route path="/home" element={<Home />} />
        <Route path="/top10" element={<Top10 />} />
        <Route path="/library" element={<Library />} />
        <Route path="/likedsongs" element={<LikedSongs />} />
        <Route path="/search" element={<Search />} />
        <Route path="/createplaylist" element={<CreatePlaylist />} />

        {/* Painel admin */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Qualquer rota desconhecida volta pro login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
