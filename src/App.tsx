import { useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

// Contexto
import {
  MusicPlayerProvider,
  useMusicPlayer, // <-- Importa o hook
} from "@/contexts/MusicPlayerContext.tsx";

// Componentes
import MusicPlayer from "@/components/MusicPlayer.tsx";

// Páginas
import Home from "@/pages/Home.tsx";
import Top10 from "@/pages/Top10.tsx";
import Library from "@/pages/Library.tsx";
import LikedSongs from "@/pages/LikedSongs.tsx";
import Search from "@/pages/Search.tsx";
import CreatePlaylist from "@/pages/CreatePlaylist.tsx";
import AdminPanel from "@/pages/AdminPanel.tsx";
import Profile from "@/pages/Profile.tsx";
import { AuthPage } from "@/pages/AuthPage.tsx";

// ===============================
// Rota Protegida (Helper)
// ===============================
function PrivateRoute({ element }: { element: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }
  return element;
}

function AppContent() {
  // Lê o estado do player
  const { currentTrack } = useMusicPlayer();

  // Carrega o tema
  useEffect(() => {
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
    <div className={`relative min-h-screen ${currentTrack ? "pb-20" : ""}`}>
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
  );
}

// ===============================
// App principal (agora é só o "casulo")
// ===============================
export default function App() {
  return (
    <Router>
      <MusicPlayerProvider>
        <Toaster richColors position="bottom-right" />
        <AppContent /> {/* Renderiza o conteúdo que lê o contexto */}
        <MusicPlayer /> {/* Renderiza o player */}
      </MusicPlayerProvider>
    </Router>
  );
}