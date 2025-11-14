// src/pages/Top10.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar.tsx"; // Import com alias
import PlaylistMenu from "@/components/PlaylistMenu.tsx"; // Import do menu

// Interface para a música do Top 10
// (O menu precisa de 'id', 'title', 'artist', 'image', 'url')
interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  preview_url?: string | null; // O menu espera, mas pode ser nulo
}

// Interface para as playlists do usuário
interface Playlist {
  id: number;
  nome: string;
}

// Função de busca do Genius (corrigida)
function getGeniusUrl(title: string, artist: string) {
  const formattedQuery = encodeURIComponent(`${title} ${artist}`);
  return `https://genius.com/search?q=${formattedQuery}`;
}

export default function Top10() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]); // Estado para playlists
  const [userId, setUserId] = useState<number | null>(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  // Pega o ID do usuário
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

  // Busca o Top 10 e as Playlists do usuário
  useEffect(() => {
    const loadData = async () => {
      try {
        // Busca o Top 10 (não precisa de ID de usuário)
        const top10Res = await axios.get(`${API_BASE}/api/spotify/top10`);
        setTracks(top10Res.data || []);

        // Se tiver usuário, busca as playlists dele
        if (userId) {
          const playlistsRes = await axios.get(
            `${API_BASE}/api/playlists/${userId}`
          );
          setPlaylists(playlistsRes.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    loadData();
  }, [userId, API_BASE]); // Roda quando o userId é pego

  return (
    // --- LAYOUT CORRIGIDO ---
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        {/* --- FIM DA CORREÇÃO --- */}
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          Top 10 da Semana 🎧
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((t: Track) => (
            <div
              key={t.id}
              className="bg-white border rounded-xl shadow-sm p-3 flex flex-col gap-3"
            >
              <img
                src={t.image}
                alt={t.title}
                className="rounded-md w-full h-36 object-cover"
              />
              <div>
                <h3 className="font-medium truncate">{t.title}</h3>
                <p className="text-sm text-gray-500 truncate">{t.artist}</p>
              </div>

              {/* --- LINKS (COM LETRA E 3 PONTINHOS) --- */}
              <div className="flex justify-between items-center mt-auto pt-2">
                <a
                  href={getGeniusUrl(t.title, t.artist)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  Letra (Genius)
                </a>

                <div className="flex items-center gap-2">
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-green-600 hover:underline"
                  >
                    Spotify
                  </a>

                  {/* --- 3 PONTINHOS (PlaylistMenu) --- */}
                  <PlaylistMenu
                    track={t}
                    playlists={playlists}
                    userId={userId}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}