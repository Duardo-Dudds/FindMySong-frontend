// src/pages/Library.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar.tsx"; // Import com alias
import { ListMusic, Music } from "lucide-react"; // Ícones para os títulos

// Interface para Músicas Salvas
interface Musica {
  spotify_id: string;
  titulo: string;
  artista: string;
  imagem: string;
  url: string;
}

// Interface para Playlists Criadas
interface Playlist {
  id: number;
  nome: string;
  descricao?: string;
}

// Função de busca do Genius (corrigida)
function getGeniusUrl(title: string, artist: string) {
  const formattedQuery = encodeURIComponent(`${title} ${artist}`);
  return `https://genius.com/search?q=${formattedQuery}`;
}

export default function Library() {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]); // Estado para playlists
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

  // Busca Músicas e Playlists
  useEffect(() => {
    if (!userId) return;
    
    const loadLibraryData = async () => {
      setLoading(true);
      try {
        // Busca os dois ao mesmo tempo
        const [musicasRes, playlistsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/library/${userId}`),
          axios.get(`${API_BASE}/api/playlists/${userId}`)
        ]);
        
        setMusicas(musicasRes.data);
        setPlaylists(playlistsRes.data);

      } catch (err) {
        console.error("Erro ao carregar biblioteca:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLibraryData();
  }, [userId, API_BASE]); // Adicionei API_BASE aqui

  return (
    // --- LAYOUT CORRIGIDO ---
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        {/* --- FIM DA CORREÇÃO --- */}
        <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          Sua Biblioteca 🎶
        </h1>

        {loading ? (
          <p className="text-gray-500">Carregando biblioteca...</p>
        ) : (
          <>
            {/* --- SEÇÃO DE PLAYLISTS CRIADAS --- */}
            {playlists.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ListMusic size={22} /> Suas Playlists
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {playlists.map((pl) => (
                    <div
                      key={pl.id}
                      className="bg-gray-50 border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col gap-3 cursor-pointer"
                      // Futuramente, podemos fazer isso ser um link
                      // onClick={() => navigate(`/playlist/${pl.id}`)} 
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-lg truncate">{pl.nome}</h3>
                        <p className="text-sm text-gray-500 truncate line-clamp-2">
                          {pl.descricao || "Nenhuma descrição"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Playlist</p>
                    </div>
                  ))}
                </div>
                <hr className="my-8" />
              </div>
            )}
            
            {/* --- SEÇÃO DE MÚSICAS SALVAS --- */}
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Music size={22} /> Músicas Salvas
            </h2>
            {musicas.length === 0 ? (
              <p className="text-gray-400">Você ainda não adicionou músicas à biblioteca.</p>
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
          </>
        )}
      </main>
    </div>
  );
}