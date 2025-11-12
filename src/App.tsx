import { useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { AuthPage } from "./pages/AuthPage";

// IMPORTAÇÕES DO PLAYER
import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import MusicPlayer from "./components/MusicPlayer";

import Home from "./pages/Home";
import Top10 from "./pages/Top10";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Search from "./pages/Search";
import CreatePlaylist from "./pages/CreatePlaylist";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";

function PrivateRoute({ element }: { element: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }
  return element;
}

export default function App() {
  useEffect(() => {
    // ... seu código de carregar tema ...
    const API_BASE =
      import.meta.env.VITE_API_BASE_URL ||
      "https://findmysong-backend.onrender.com";

    axios
      .get(`${API_BASE}/api/admin/config`)
      .then((res) => {
        document.body.classList.remove("theme-halloween", "theme-natal");

        if (res.data.theme === "halloween") {
          document.body.classList.add("theme-halloween");
        } else if (res.data.theme === "natal") {
          document.body.classList.add("theme-natal");
        }
      })
      .catch((err) => {
        console.warn("Erro ao carregar tema admin:", err.message);
      });
  }, []);

  return (
    // ENVOLVA TUDO COM O PROVIDER
    <MusicPlayerProvider>
      <Router>
        <Toaster richColors position="bottom-right" />
        <div className="pb-20"> {/* Adiciona padding p/ o player não cobrir o conteúdo */}
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/home" element={<PrivateRoute element={<Home />} />} />
            <Route path="/top10" element={<PrivateRoute element={<Top10 />} />} />
            <Route path="/library" element={<PrivateRoute element={<Library />} />} />
            <Route
              path="/likedsongs"
              element={<PrivateRoute element={<LikedSongs />} />}
            />
            <Route path="/search" element={<PrivateRoute element={<Search />} />} />
            <Route
              path="/createplaylist"
              element={<PrivateRoute element={<CreatePlaylist />} />}
            />
            <Route
              path="/admin"
              element={<PrivateRoute element={<AdminPanel />} />}
            />
            <Route
              path="/profile"
              element={<PrivateRoute element={<Profile />} />}
            />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
        
        {/* RENDERIZA O PLAYER GLOBAL AQUI */}
        <MusicPlayer />

      </Router>
    </MusicPlayerProvider>
  );
}