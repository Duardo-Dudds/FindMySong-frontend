// src/pages/Home.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Play } from "lucide-react";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album?: { images?: { url: string }[] };
  external_urls?: { spotify?: string };
  preview_url?: string | null;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  // identifica o usuário logado
  useEffect(() => {
  const token = localStorage.getItem("token");

  // Se não houver token válido, redireciona pro login
  if (!token || token === "undefined") {
    window.location.href = "/login";
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserId(payload.id);
  } catch (err) {
    console.error("Token inválido:", err);
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}, []);

  // carrega curtidas salvas do banco
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${API_BASE}/api/likes/${userId}`)
      .then((res) => {
        setLiked(res.data.map((m: any) => m.spotify_id));
      })
      .catch(() => console.log("Erro ao carregar curtidas"));
  }, [userId]);

  async function buscar() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/spotify/search`, {
        params: { q: query },
      });

      const data: Track[] = Array.isArray(res.data)
        ? res.data
        : res.data.tracks?.items || [];

      setResults(data);
    } catch (err) {
      console.error("Erro ao buscar músicas:", err);
      alert("Erro ao buscar músicas.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleLike(track: Track) {
    if (!userId) {
      alert("Faça login para curtir músicas.");
      return;
    }

    const jaCurtiu = liked.includes(track.id);
    try {
      if (jaCurtiu) {
        await axios.delete(`${API_BASE}/api/likes/${track.id}/${userId}`);
        setLiked(liked.filter((id) => id !== track.id));
      } else {
        await axios.post(`${API_BASE}/api/likes`, {
          usuario_id: userId,
          spotify_id: track.id,
          titulo: track.name,
          artista: track.artists?.[0]?.name,
          imagem: track.album?.images?.[0]?.url,
          url: track.external_urls?.spotify,
        });
        setLiked([...liked, track.id]);
      }
    } catch (err) {
      console.error("Erro ao atualizar curtida:", err);
    }
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        {/* título */}
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          Explore músicas 🎵
        </h2>

        {/* barra de busca */}
        <div className="mb-8 flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por música, artista ou letra..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={buscar}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Buscar
          </button>
        </div>

        {/* lista */}
        {loading ? (
          <p className="text-gray-500">Buscando músicas...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-400">
            Digite algo acima para pesquisar no Spotify.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((m) => (
              <div
                key={m.id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col gap-3"
              >
                <div className="relative">
                  <img
                    src={m.album?.images?.[0]?.url}
                    alt={m.name}
                    className="rounded-md w-full h-36 object-cover"
                  />
                  <button
                    onClick={() => {
                      if (m.preview_url) {
                        const audio = new Audio(m.preview_url);
                        audio.play();
                      } else if (m.external_urls?.spotify) {
                        window.open(m.external_urls.spotify, "_blank");
                      }
                    }}
                    className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition group"
                  >
                    <Play size={16} />
                  </button>
                </div>

                <div>
                  <h3 className="font-medium truncate">{m.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {m.artists?.[0]?.name}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  {/* like */}
                  <button
                    onClick={() => toggleLike(m)}
                    className={`text-lg ${
                      liked.includes(m.id)
                        ? "text-red-500"
                        : "text-gray-300 hover:text-red-400"
                    }`}
                  >
                    ♥
                  </button>

                  {/* spotify */}
                  {m.external_urls?.spotify && (
                    <a
                      href={m.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Spotify
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
