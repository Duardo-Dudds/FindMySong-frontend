// src/pages/LikedSongs.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar.tsx"; // Import com alias

interface Musica {
  spotify_id: string;
  titulo: string;
  artista: string;
  imagem: string;
  url: string;
}

// Função de busca do Genius (corrigida)
function getGeniusUrl(title: string, artist: string) {
  const formattedQuery = encodeURIComponent(`${title} ${artist}`);
  return `https://genius.com/search?q=${formattedQuery}`;
}

export default function LikedSongs() {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      } catch {
        console.warn("Token inválido");
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const loadLikes = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/likes/${userId}`);
        setMusicas(res.data);
      } catch (err) {
        console.error("Erro ao buscar músicas curtidas:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLikes();
  }, [userId, API_BASE]); // Adicionei API_BASE

  return (
    // --- LAYOUT CORRIGIDO ---
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        {/* --- FIM DA CORREÇÃO --- */}
        <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          Músicas curtidas 💖
        </h1>

        {loading ? (
          <p className="text-gray-500">Carregando suas músicas...</p>
        ) : musicas.length === 0 ? (
          <p className="text-gray-400">Você ainda não curtiu nenhuma música.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {musicas.map((m) => (
              <div
                key={m.spotify_id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col gap-3"
              >
                <img
                  src={m.imagem}
                  alt={m.titulo}
                  className="rounded-md w-full h-36 object-cover"
                />
                <div>
                  <h3 className="font-medium truncate">{m.titulo}</h3>
                  <p className="text-sm text-gray-500 truncate">{m.artista}</p>
                </div>

                {/* --- LINKS (COM LETRA) --- */}
                <div className="flex justify-between items-center mt-auto pt-2">
                  <a
                    href={getGeniusUrl(m.titulo, m.artista)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Letra (Genius)
                  </a>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-green-600 hover:underline"
                  >
                    Spotify
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </a-main>
    </div>
  );
}