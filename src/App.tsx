// src/App.tsx (VERSÃO ATUALIZADA)
import { useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importe o Toaster para as notificações da nova tela
import { Toaster } from "sonner";

import Home from "./pages/Home";
import Top10 from "./pages/Top10";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Search from "./pages/Search";
import CreatePlaylist from "./pages/CreatePlaylist";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";

// PÁGINA UNIFICADA
import { AuthPage } from "./pages/AuthPage";

// ===============================
// Rota protegida (só entra se tiver token)
// ===============================
function PrivateRoute({ element }: { element: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }
  return element;
}

// ===============================
// App principal
// ===============================
export default function App() {
  // Carrega configurações globais (tema, etc)
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
    <Router>
      {/* Toaster para funcionar em toda a app */}
      <Toaster richColors position="bottom-right" />
      <Routes>
        {/* Rota padrão → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Públicas */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Protegidas */}
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

        {/* Qualquer rota inválida → Home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}